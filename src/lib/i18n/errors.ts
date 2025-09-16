const errorMessages: Record<string, string> = {
  "error.validation.failed": "La validación ha fallado.",
  "error.validation.unknown": "Error de validación desconocido.",
  "error.entity.not_found": "Entidad no encontrada.",
  "error.resource.not_found": "Recurso no encontrado.",
  "error.http.method_not_allowed": "Método HTTP no permitido.",
  "error.internal": "Error interno.",

  // Auth
  "error.auth.bad_credentials": "Credenciales incorrectas.",
  "error.auth.access_denied": "Acceso denegado.",

  // Usuario
  "error.username.required": "El nombre de usuario es obligatorio.",
  "error.username.min_length": "El nombre de usuario es demasiado corto.",
  "error.username.max_length": "El nombre de usuario es demasiado largo.",
  "error.username.invalid_chars": "El nombre de usuario contiene caracteres inválidos.",
  "error.username.already_exists": "El nombre de usuario ya existe.",

  "error.password.required": "La contraseña es obligatoria.",
  "error.password.min_length": "La contraseña es demasiado corta.",
  "error.password.no_spaces": "La contraseña no puede contener espacios.",
  "error.password.complexity": "La contraseña no cumple con los requisitos de seguridad.",
  "error.password.same_before": "La nueva contraseña no puede ser igual a la anterior.",
  "error.password.incorrect": "La contraseña es incorrecta.",
  "error.password.mismatch": "Las contraseñas no coinciden.",

  "error.puesto.required": "El puesto es obligatorio.",

  // Tarea
  "error.descripcion.required": "La descripción es obligatoria.",
  "error.turno.required": "El turno es obligatorio.",
  "error.tipoRecurrencia.required": "El tipo de recurrencia es obligatorio.",
  "error.diames.invalid.range": "El día del mes está fuera de rango.",
};


export const translate = (key: string): string => {
  return errorMessages[key] || key;
};
