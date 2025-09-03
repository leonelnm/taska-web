import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { TareasApi } from "$lib/api/tareasApi";
import { RecurrenceType, type CrearTareaRequest, type DiaSemana } from "$lib/types";

export const load: PageServerLoad = async ({ fetch, locals }) => {

  const { user } = locals

  if (!user?.isAdmin) {
    throw redirect(303, '/')
  }

  const tareasApi = new TareasApi(fetch);
  const puestos = await tareasApi.getPuestos();
  const turnos = await tareasApi.getTurnos();

  return {
    puestos, turnos
  }

};

export const actions: Actions = {

  default: async ({ request, fetch }) => {
    const fd = await request.formData();

    const descripcion = fd.get('descripcion');
    const puestoId = fd.get('puesto');
    const turnoId = fd.get('turno');
    const tipoRecurrencia = fd.get('recurrencia') as RecurrenceType;
    const diaSemana = fd.get('diaSemana');
    const diaMes = fd.get('diaMes');
    const fecha = fd.get('fecha');


    // Validación detallada del lado del servidor
    if (!descripcion) return fail(400, { message: 'La descripción es obligatoria.' });
    if (!puestoId) return fail(400, { message: 'El puesto es obligatorio.' });
    if (!turnoId) return fail(400, { message: 'El turno es obligatorio.' });
    if (!tipoRecurrencia) return fail(400, { message: 'La recurrencia es obligatoria.' });

    switch (tipoRecurrencia) {
      case RecurrenceType.SEMANAL:
      case RecurrenceType.QUINCENAL:
        if (!diaSemana) {
          return fail(400, { message: 'El día de la semana es obligatorio para esta recurrencia.' });
        }
        break;
      case RecurrenceType.MENSUAL:
        if (!diaMes) {
          return fail(400, { message: 'El día del mes es obligatorio para esta recurrencia.' });
        }
        break;
      case RecurrenceType.UNA_VEZ:
        if (!fecha) {
          return fail(400, { message: 'La fecha es obligatoria para esta recurrencia.' });
        }
        break;
    }

    const payload: CrearTareaRequest = {
      puestoId: Number(puestoId),
      turnoId: Number(turnoId),
      descripcion: String(descripcion),
      tipoRecurrencia,
      diaSemana: diaSemana as DiaSemana ?? undefined,
      diaMes: diaMes ? Number(diaMes) : undefined,
      fecha: fecha ? String(fecha) : undefined
    };

    const tareasApi = new TareasApi(fetch);
    try {
      await tareasApi.crearTarea(payload)
    } catch {
      return fail(400, {
        message: 'No se pudo crear la tarea, vuelve a intentar'
      });
    }

    return {
      success: true,
    }

  }

} 