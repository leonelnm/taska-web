import { fail, redirect, type Actions } from "@sveltejs/kit";
import { Constants } from "$lib/constants";
import type { PageServerLoad } from "./$types";
import { loginApi } from "$lib/api/authApi";
import { Fetch, type FetchError } from "$lib/api/fetchClient";

export const load: PageServerLoad = ({ locals }) => {
  const user = locals.user

  if (user) {
    redirect(303, '/')
  }

};

export const actions: Actions = {
  default: async ({ request, cookies, fetch }) => {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
      return fail(400, {
        error: 'Faltan el nombre de usuario o la contraseña.'
      });
    }

    try {
      const { token, refreshToken } = await loginApi(new Fetch(fetch), username.trim(), password.trim());

      cookies.set(Constants.COOKIE_SESSION_NAME, token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 1
      });

      cookies.set(Constants.COOKIEA_REFRESH_TOKEN, refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      });

    } catch (err) {
      const error = err as FetchError
      if (error.response?.status === 401) {
        return fail(401, {
          error: error.message || 'error.auth.bad_credentials'
        });
      }

      return fail(500, {
        error: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.'
      });
    }


    throw redirect(303, '/')

  }
}