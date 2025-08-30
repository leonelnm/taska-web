import { fail, redirect, type Actions } from "@sveltejs/kit";
import { Constants } from "$lib/constants";
import type { PageServerLoad } from "./$types";
import type { LoginResponse } from "$lib/types";

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
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include'
      })

      console.log('login response', response);


      if (!response.ok) {
        return fail(400, {
          error: 'Credenciales incorrectas'
        })
      }

      const { token, refreshToken }: LoginResponse = await response.json();

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


    } catch {
      return fail(500, {
        error: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.'
      });
    }


    redirect(303, '/')

  }
}