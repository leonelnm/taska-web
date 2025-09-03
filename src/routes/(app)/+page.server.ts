import { filtroTareaToSearchParams } from "$lib/api/utils";
import { formDataToFiltroTarea } from "$lib/api/utils";
import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { searchParamsToFiltroTarea } from "$lib/api/utils";
import { TareasApi } from "$lib/api/tareasApi";

export const load: PageServerLoad = async ({ fetch, url, locals }) => {

  const filtro = searchParamsToFiltroTarea(url.searchParams)

  const tareasApi = new TareasApi(fetch);

  const [tareas, puestos, turnos] = await Promise.all([
    tareasApi.getTareas(filtro),
    tareasApi.getPuestos(),
    tareasApi.getTurnos()])

  const isAdmin = locals.user?.isAdmin

  return {
    tareas,
    puestos,
    turnos,
    filtro,
    isAdmin
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