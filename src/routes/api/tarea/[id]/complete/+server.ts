import { TareasApi } from "$lib/api/tareasApi";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ params, fetch }) => {
  const { id } = params

  if (isNaN(Number(id))) {
    return json({ success: false, message: 'ID inválido' }, { status: 400 });
  }

  const tareaApi = new TareasApi(fetch)

  try {
    await tareaApi.completarTarea(Number(id));
    return json({ success: true });
  } catch {
    return json(
      { success: false, message: 'Error completando la tarea' },
      { status: 400 }
    );
  }
};