import { filtroTareaToSearchParams } from "$lib/api/utils";
import { formDataToFiltroTarea } from "$lib/api/utils";
import type { Actions } from "@sveltejs/kit";
import { searchParamsToFiltroTarea } from "$lib/api/utils";
import { TareasApi } from "$lib/api/tareasApi";
import type { PageServerLoad } from "../$types";

export const load: PageServerLoad = async ({ fetch, url }) => {

  const filtro = searchParamsToFiltroTarea(url.searchParams)

  if (filtro.fecha === undefined) {
    filtro.fecha = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  const tareasApi = new TareasApi(fetch);

  const tareas = await tareasApi.getTareas(filtro)

  return {
    tareas,
    filtro,
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
  }

}