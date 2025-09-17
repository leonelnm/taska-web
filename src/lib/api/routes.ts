export const Routes = {
  AUTH: {
    LOGIN: '/auth/login',        // POST
    REFRESH: '/auth/refresh',    // POST
  },
  PROFILE: {
    BASE: '/profile/me',         // GET
    CHANGE_PASSWORD: '/profile/me/password', // POST
  },
  USERS: {
    BASE: '/users',              // GET
    CREATE: '/users',            // POST
    CHANGE_PASSWORD: '/users/password', // POST
    ACTIVATE: (username: string) => `/users/${username}/activar`,   // PUT
    DEACTIVATE: (username: string) => `/users/${username}/desactivar` // PUT
  },
  PUESTOS: {
    BASE: '/puestos',            // GET
  },
  TURNOS: {
    BASE: '/turnos',             // GET
  },
  TAREAS: {
    BASE: '/tareas',             // GET con filtros
    CREATE: '/tareas',           // POST
    CREATE_BATCH: '/tareas/batch', // POST
    ALL: '/tareas/all',          // GET (solo admin)
    COMPLETE: (id: number) => `/tareas/${id}/completar`, // POST
  },
} as const;
