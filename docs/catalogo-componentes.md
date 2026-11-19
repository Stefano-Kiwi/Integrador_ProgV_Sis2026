# Catálogo de Componentes — Atomic Design (`frontend/src/components/`)

Arquitectura basada en **Atomic Design** organizada en tres niveles: `atoms/`, `molecules/` y `organisms/`.

## Átomos (`src/components/atoms/`)

| Componente | Archivo | Props principales | Uso |
| :--- | :--- | :--- | :--- |
| `Button` | `atoms/Button.tsx` | `variant?: "primary" \| "secondary" \| "danger" \| "ghost"`, `loading?: boolean`, `fullWidth?: boolean`, `...ButtonHTMLAttributes` | Botón reutilizable con estado de carga y variantes visuales. |
| `Input` | `atoms/Input.tsx` | `hasError?: boolean`, `...InputHTMLAttributes` | Campo de entrada de texto/fecha/número con borde de error. |
| `Badge` | `atoms/Badge.tsx` | `variant?: "success" \| "warning" \| "danger" \| "info" \| "neutral"`, `children` | Etiqueta de estado (membresía, horario pico, disponibilidad, conectividad). |
| `Spinner` | `atoms/Spinner.tsx` | `size?: "sm" \| "md" \| "lg"`, `label?: string` | Indicador accesible (`role="status"`) de carga asincrónica. |

## Moléculas (`src/components/molecules/`)

| Componente | Archivo | Props principales | Uso |
| :--- | :--- | :--- | :--- |
| `FormField` | `molecules/FormField.tsx` | `label: string`, `htmlFor?: string`, `error?: string \| null`, `hint?: string`, `required?: boolean`, `children` | Agrupa etiqueta, control de entrada y mensaje de validación/ayuda. |
| `Card` | `molecules/Card.tsx` | `title?: string`, `subtitle?: string`, `headerAction?: ReactNode`, `children`, `className?`, `style?` | Contenedor estándar para secciones del portal y la consola de administración. |
| `AlertMessage` | `molecules/AlertMessage.tsx` | `variant: "success" \| "error" \| "warning" \| "info"`, `title?: string`, `message: string`, `onClose?: () => void` | Banner de feedback accesible (`role="alert"`) con cierre opcional. |

## Organismos (`src/components/organisms/`)

| Componente | Archivo | Props principales | Uso |
| :--- | :--- | :--- | :--- |
| `Navbar` | `organisms/Navbar.tsx` | *(sin props; consume sesión/estado)* | Barra de navegación principal del portal del socio. |
| `RequireAuth` | `organisms/RequireAuth.tsx` | *(wrapper de rutas con `<Outlet />`)* | Guardia de rutas protegidas para la consola de administración (`/admin`). |
| `TablaDatos<T>` | `organisms/TablaDatos.tsx` | `columns: ColumnaTabla<T>[]`, `rows: T[]`, `rowKey`, `loading?: boolean`, `emptyMessage?: string` | Tabla genérica tipada con estado de carga y mensaje vacío. |
| `GrillaHoraria` | `organisms/GrillaHoraria.tsx` | `franjas: FranjaHorariaItem[]`, `horaSeleccionada: number \| null`, `onSelectHora` | Grilla interactiva de turnos de cancha con disponibilidad y precio dinámico (RF-10/RF-11). |
| `AdminInscripcionClase` | `organisms/AdminInscripcionClase.tsx` | `claseId`, `onInscripto` | Panel de inscripción manual de socios a una clase grupal desde administración. |
