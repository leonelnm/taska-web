import { DiaSemana, RecurrenceType, type Recurrence, type DiaSemanaWithLabel, type TareaResponse, type TareaApp, type FiltroTareaRequest } from "$lib/types";

export const getRecurrences = (): Recurrence[] => {
  return [
    { recurrenceType: RecurrenceType.DIARIA, label: 'Diaria' },
    { recurrenceType: RecurrenceType.SEMANAL, label: 'Semanal' },
    { recurrenceType: RecurrenceType.QUINCENAL, label: 'Quincenal' },
    { recurrenceType: RecurrenceType.MENSUAL, label: 'Mensual' },
    { recurrenceType: RecurrenceType.UNA_VEZ, label: 'Una vez' }
  ];
}

export const getDiasSemana = (): DiaSemanaWithLabel[] => {
  return [
    { diaSemana: DiaSemana.LUNES, label: 'Lunes' },
    { diaSemana: DiaSemana.MARTES, label: 'Martes' },
    { diaSemana: DiaSemana.MIERCOLES, label: 'Miércoles' },
    { diaSemana: DiaSemana.JUEVES, label: 'Jueves' },
    { diaSemana: DiaSemana.VIERNES, label: 'Viernes' },
    { diaSemana: DiaSemana.SABADO, label: 'Sábado' },
    { diaSemana: DiaSemana.DOMINGO, label: 'Domingo' }
  ];
}

export const getLabelFromString = (key: string): string => {
  const mapper: Record<string, string> = {
    'ENCARGADO': 'Encargado',
    'COCINERO': 'Cocinera',
    'CAMARERO': 'Camarera',
    'PINCHE': 'Ayudante Cocina',
    'MANANA': 'Mañana',
    'MEDIO': 'Medio día',
    'TARDE': 'Tarde'
  };

  return mapper[key] || key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
}

export const mapTarea = (tarea: TareaResponse): TareaApp => {
  return {
    ...tarea,
    puesto: {
      ...tarea.puesto,
      label: getLabelFromString(tarea.puesto.puesto)
    },
    turno: {
      ...tarea.turno,
      label: getLabelFromString(tarea.turno.turno)
    },
    recurrencia: {
      recurrenceType: tarea.tipoRecurrencia,
      label: getRecurrences().find(r => r.recurrenceType === tarea.tipoRecurrencia)?.label
    }
  };
}

export function formDataToFiltroTarea(formData: FormData): FiltroTareaRequest {
  const obj = Object.fromEntries(formData.entries());
  return {
    turnoId: obj.turnoId ? Number(obj.turnoId) : undefined,
    puestoId: obj.puestoId ? Number(obj.puestoId) : undefined,
    tipoRecurrencia: obj.tipoRecurrencia
      ? (obj.tipoRecurrencia as RecurrenceType)
      : undefined,
    diaSemana: obj.diaSemana ? (obj.diaSemana as DiaSemana) : undefined,
    completada: obj.completada
      ? obj.completada === "true" || obj.completada === "on" // según tu <input type="checkbox">
      : undefined,
    fecha: obj.fecha ? String(obj.fecha) : undefined
  };
}

export function filtroTareaToSearchParams(filtro: FiltroTareaRequest): URLSearchParams {
  const params = new URLSearchParams();

  if (filtro.turnoId !== undefined) params.set("turnoId", String(filtro.turnoId));
  if (filtro.puestoId !== undefined) params.set("puestoId", String(filtro.puestoId));
  if (filtro.tipoRecurrencia !== undefined) params.set("tipoRecurrencia", filtro.tipoRecurrencia);
  if (filtro.diaSemana !== undefined) params.set("diaSemana", filtro.diaSemana);
  if (filtro.completada !== undefined) params.set("completada", String(filtro.completada));
  if (filtro.fecha !== undefined) params.set("fecha", filtro.fecha);

  return params;
}

export function searchParamsToFiltroTarea(params: URLSearchParams): FiltroTareaRequest {
  const getNumber = (key: string): number | undefined => {
    const value = params.get(key);
    return value !== null ? Number(value) : undefined;
  };

  const getBoolean = (key: string): boolean | undefined => {
    const value = params.get(key);
    if (value === null) return undefined;
    return value === "true" || value === "1";
  };

  const getParam = <T>(params: URLSearchParams, key: string): (T | undefined) => {
    const value = params.get(key);
    return value !== null ? (value as T) : undefined;
  }

  return {
    turnoId: getNumber("turnoId"),
    puestoId: getNumber("puestoId"),
    tipoRecurrencia: getParam<RecurrenceType>(params, "tipoRecurrencia"),
    diaSemana: getParam<DiaSemana>(params, "diaSemana"),
    completada: getBoolean("completada"),
    fecha: getParam<string>(params, "fecha")
  };
}