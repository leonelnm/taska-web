import { filtroTareaToSearchParams } from "$lib/api/utils";
import { formDataToFiltroTarea } from "$lib/api/utils";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { searchParamsToFiltroTarea } from "$lib/api/utils";
import { TareasApi } from "$lib/api/tareasApi";
import { nowToString } from "$lib/api/dateUtils";

export const load: PageServerLoad = async ({ fetch, url, locals }) => {

  const filtro = searchParamsToFiltroTarea(url.searchParams)

  const isAdmin = locals.user?.isAdmin

  if (filtro.fecha === undefined) {
    filtro.fecha = nowToString(); // Formato YYYY-MM-DD
  }

  const tareasApi = new TareasApi(fetch);

  const [tareas, puestos, turnos] = await Promise.all([
    tareasApi.getTareas(filtro),
    tareasApi.getPuestos(),
    tareasApi.getTurnos()])

  return {
    tareas,
    puestos,
    turnos,
    filtro,
    isAdmin
  }

};

export const actions: Actions = {

  filter: async ({ request }) => {
    const formData = await request.formData();
    const filtro = formDataToFiltroTarea(formData);
    const params = filtroTareaToSearchParams(filtro);

    return {
      params: params.toString(),
    }
  },

  complete: async ({ request, fetch }) => {
    const data = await request.formData();
    const id = data.get("id") as string;

    const tareasApi = new TareasApi(fetch);
    await tareasApi.completarTarea(Number(id));

    return { success: true };
  }

}