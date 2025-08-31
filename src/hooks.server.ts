import { redirect, type Handle, type HandleFetch } from '@sveltejs/kit';
import { Fetch } from '$lib/api/fetchClient';
import { Constants } from '$lib/constants';
import type { ProfileResponse } from '$lib/types';
import { profileApi } from '$lib/api/authApi';
import { config } from '$lib/config';

const profileCache = new Map<string, { data: ProfileResponse; expiresAt: number }>();
const PROFILE_CACHE_TTL = 60 * 1000;

interface CustomResponse {
  success: boolean,
  data?: ProfileResponse
}

async function validateToken(fetchFn: typeof fetch, token: string): Promise<CustomResponse> {
  const cached = profileCache.get(token);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return { success: true, data: cached.data };
  }

  try {
    const response = await profileApi(new Fetch(fetchFn))
    profileCache.set(token, { data: response, expiresAt: now + PROFILE_CACHE_TTL });

    return {
      success: true,
      data: response
    }
  } catch {
    return {
      success: false,
    };
  }

}

// El hook 'handle' se ejecuta en cada solicitud.
export const handle: Handle = async ({ event, resolve }) => {

  // Leer la cookie de sesión de la solicitud.
  const sessionToken = event.cookies.get(Constants.COOKIE_SESSION_NAME);

  if (sessionToken) {
    const { success, data } = await validateToken(event.fetch, sessionToken);

    if (success && data) {
      event.locals.user = data;
    } else {
      event.cookies.delete(Constants.COOKIE_SESSION_NAME, { path: '/' })
      event.locals.user = null
    }
  } else {
    event.locals.user = null
  }

  const isLogin = event.url.pathname.startsWith('/login');
  const isAuthenticated = !!event.locals.user;

  if (!isAuthenticated && !isLogin) {
    throw redirect(303, '/login');
  }

  if (isLogin && isAuthenticated) {
    throw redirect(303, '/');
  }

  return resolve(event);
};

export const handleFetch: HandleFetch = async ({ request, event, fetch }) => {

  if (request.url.startsWith(config.BASE_PATH)) {
    const sessionToken = event.cookies.get(Constants.COOKIE_SESSION_NAME);

    const newRequest = request.clone();

    if (sessionToken) {
      newRequest.headers.set('Authorization', `Bearer ${sessionToken}`);
    }

    const response = await fetch(newRequest);

    // Si el token expiró, intentamos refrescarlo.
    if (!response.ok && response.status === 401) {
      try {

        const refreshResponse = await fetch(`${config.BASE_PATH}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });

        if (refreshResponse.ok) {
          const { token: newAuthToken, refreshToken } = await refreshResponse.json();

          // Guarda el nuevo token de sesión.
          event.cookies.set(Constants.COOKIE_SESSION_NAME, newAuthToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 1
          });

          event.cookies.set(Constants.COOKIEA_REFRESH_TOKEN, refreshToken, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7
          });

          // Vuelve a intentar la petición original con el nuevo token.
          const retryRequest = request.clone();
          retryRequest.headers.set('Authorization', `Bearer ${newAuthToken}`);

          return fetch(retryRequest);
        }
      } catch (err) {
        console.error('Error al refrescar el token:', err);
        event.cookies.delete(Constants.COOKIE_SESSION_NAME, { path: '/' });
        event.cookies.delete(Constants.COOKIEA_REFRESH_TOKEN, { path: '/' });
      }

      throw redirect(303, '/login');
    }

    return response;
  }

  return fetch(request);
}