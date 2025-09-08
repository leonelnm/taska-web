import { UserApi } from "$lib/api/usuarioApi";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {

  const userApi = new UserApi(fetch)

  const users = await userApi.getUsers();
  console.log({ users });


  return {
    users
  }
};