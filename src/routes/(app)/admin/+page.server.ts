import { TareasApi } from "$lib/api/tareasApi";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { filtroTareaToSearchParams, formDataToFiltroTarea, searchParamsToFiltroTarea } from "$lib/api/utils";

export const load: PageServerLoad = async ({ fetch, url, locals }) => {

  const { user } = locals

  if (!user?.isAdmin) {
    throw redirect(303, '/')
  }

  const filtro = searchParamsToFiltroTarea(url.searchParams)

  const tareasApi = new TareasApi(fetch);

  const tareas = await tareasApi.getTareas(filtro);
  const puestos = await tareasApi.getPuestos();
  const turnos = await tareasApi.getTurnos();

  return {
    tareas, puestos, turnos, filtro
  }

};

export const actions: Actions = {

  filter: async ({ request, url }) => {
    const formData = await request.formData();
    const filtro = formDataToFiltroTarea(formData);
    const params = filtroTareaToSearchParams(filtro);

    throw redirect(303, url.pathname + '?' + params.toString());

  }

} 