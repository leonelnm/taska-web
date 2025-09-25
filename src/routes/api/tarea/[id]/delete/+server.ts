import { TareasApi } from "$lib/api/tareasApi";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params, request, fetch }) => {
  const { id } = params;

  if (isNaN(Number(id))) {
    return json({ success: false, message: 'ID inválido' }, { status: 400 });
  }

  let deleteAll = false;

  try {
    const body = await request.json();
    deleteAll = body.deleteAll || false;
  } catch {
    // Si no hay body o no es JSON válido, usar valor por defecto
    deleteAll = false;
  }

  const tareaApi = new TareasApi(fetch);

  try {
    if (deleteAll) {
      await tareaApi.eliminarTodasTareas(Number(id));
    } else {
      await tareaApi.eliminarTarea(Number(id));
    }

    return json({
      success: true,
      message: deleteAll ? 'Todas las tareas eliminadas correctamente' : 'Tarea eliminada correctamente'
    });
  } catch {
    return json(
      { success: false, message: 'Error eliminando la tarea' },
      { status: 400 }
    );
  }
};
