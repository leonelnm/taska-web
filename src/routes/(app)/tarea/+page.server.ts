import { TareasApi } from "$lib/api/tareasApi";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { filtroTareaToSearchParams, formDataToFiltroTarea } from "$lib/api/utils";

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

  default: async ({ request, url }) => {
    const formData = await request.formData();
    const filtro = formDataToFiltroTarea(formData);
    const params = filtroTareaToSearchParams(filtro);

    throw redirect(303, url.pathname + '?' + params.toString());

  }

} 