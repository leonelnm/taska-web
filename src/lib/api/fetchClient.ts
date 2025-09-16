import { config } from "$lib/config";
import type { ErrorResponse } from "$lib/types";

export interface FetchError extends Error {
  response?: Response;
  details?: Record<string, string>;
}

// un cliente fetch con opciones por defecto para usar en toda la app
export const fetchClient = async <T>(
  fetch: typeof window.fetch,
  url: string,
  options: RequestInit = {}): Promise<T> => {

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const mergedOptions: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  const response = await fetch(`${config.BASE_PATH}${url}`, mergedOptions);

  if (!response.ok) {
    const error: FetchError = new Error(`Error en la petición: ${response.status}`)
    error.response = response
    throw error;
  }

  return response.json();
}

export class Fetch {
  #fetch: typeof window.fetch

  constructor(fetchFn: typeof window.fetch) {
    this.#fetch = fetchFn
  }

  public async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      return await fetchClient<T>(this.#fetch, url, options);
    } catch (error) {
      const err = error as FetchError;
      if (err.response?.status === 400) {
        const errorResponse = await err.response.json() as ErrorResponse;
        err.message = errorResponse.message ? errorResponse.message : err.message;
        err.details = errorResponse.details;
        throw err;
      } else {
        throw error
      }
    }

  }

}