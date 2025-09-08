import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { TareasApi } from "$lib/api/tareasApi";

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  const { user } = locals

  if (!user?.isAdmin) {
    throw redirect(303, '/')
  }

  const tareasApi = new TareasApi(fetch);
  const puestos = await tareasApi.getPuestos();

  console.log(puestos);


  return {
    puestos
  }

};