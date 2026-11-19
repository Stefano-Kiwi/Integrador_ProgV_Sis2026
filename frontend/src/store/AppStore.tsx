import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import {
  cerrarSesion as cerrarSesionStorage,
  obtenerMiPerfil,
  obtenerToken,
  type UsuarioSesion,
} from "../services/authService";

export interface AppState {
  usuario: UsuarioSesion | null;
  token: string | null;
  cargandoSesion: boolean;
  sedeSeleccionadaId: number | null;
  online: boolean;
}

type AppAction =
  | { type: "SET_CARGANDO_SESION"; payload: boolean }
  | { type: "SET_SESION"; payload: { usuario: UsuarioSesion | null; token: string | null } }
  | { type: "CERRAR_SESION" }
  | { type: "SET_SEDE"; payload: number | null }
  | { type: "SET_ONLINE"; payload: boolean };

const SEDE_STORAGE_KEY = "fitzone_sede_seleccionada";

function leerSedeGuardada(): number | null {
  try {
    const raw = localStorage.getItem(SEDE_STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

const initialState: AppState = {
  usuario: null,
  token: obtenerToken(),
  cargandoSesion: Boolean(obtenerToken()),
  sedeSeleccionadaId: leerSedeGuardada(),
  online: typeof navigator !== "undefined" ? navigator.onLine : true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CARGANDO_SESION":
      return { ...state, cargandoSesion: action.payload };
    case "SET_SESION":
      return {
        ...state,
        usuario: action.payload.usuario,
        token: action.payload.token,
        cargandoSesion: false,
        sedeSeleccionadaId:
          state.sedeSeleccionadaId ?? action.payload.usuario?.sede_base?.id ?? null,
      };
    case "CERRAR_SESION":
      return { ...state, usuario: null, token: null, cargandoSesion: false };
    case "SET_SEDE":
      return { ...state, sedeSeleccionadaId: action.payload };
    case "SET_ONLINE":
      return { ...state, online: action.payload };
    default:
      return state;
  }
}

export interface AppStoreValue extends AppState {
  refrescarSesion: () => Promise<void>;
  cerrarSesion: () => void;
  seleccionarSede: (sedeId: number | null) => void;
  setOnline: (online: boolean) => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const refrescarSesion = useCallback(async () => {
    const token = obtenerToken();
    if (!token) {
      dispatch({ type: "SET_SESION", payload: { usuario: null, token: null } });
      return;
    }
    dispatch({ type: "SET_CARGANDO_SESION", payload: true });
    try {
      const usuario = await obtenerMiPerfil();
      dispatch({ type: "SET_SESION", payload: { usuario, token } });
    } catch {
      dispatch({ type: "SET_SESION", payload: { usuario: null, token: obtenerToken() } });
    }
  }, []);

  const cerrarSesion = useCallback(() => {
    cerrarSesionStorage();
    dispatch({ type: "CERRAR_SESION" });
  }, []);

  const seleccionarSede = useCallback((sedeId: number | null) => {
    try {
      if (sedeId === null) localStorage.removeItem(SEDE_STORAGE_KEY);
      else localStorage.setItem(SEDE_STORAGE_KEY, String(sedeId));
    } catch {
      // ignora errores de storage en modo privado
    }
    dispatch({ type: "SET_SEDE", payload: sedeId });
  }, []);

  const setOnline = useCallback((online: boolean) => {
    dispatch({ type: "SET_ONLINE", payload: online });
  }, []);

  useEffect(() => {
    void refrescarSesion();
  }, [refrescarSesion]);

  useEffect(() => {
    const onOnline = () => dispatch({ type: "SET_ONLINE", payload: true });
    const onOffline = () => dispatch({ type: "SET_ONLINE", payload: false });
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        ...state,
        refrescarSesion,
        cerrarSesion,
        seleccionarSede,
        setOnline,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppStoreContext);
  if (!ctx) {
    throw new Error("useAppStore debe utilizarse dentro de <AppStoreProvider>");
  }
  return ctx;
}
