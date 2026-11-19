const parsedSedeId = Number(import.meta.env.VITE_SEDE_ID);
export const siteConfig = {
    clubName: import.meta.env.VITE_CLUB_NAME || "FitZone Sports Club",
    sedeNombre: import.meta.env.VITE_SEDE_NOMBRE || "Sede Central",
    sedeLocalidad: import.meta.env.VITE_SEDE_LOCALIDAD || "Concordia",
    sedeId: !isNaN(parsedSedeId) && parsedSedeId > 0 ? parsedSedeId : 1,
} as const;