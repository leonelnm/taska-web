
import { Fetch } from "$lib/api/fetchClient";
import type { LoginResponse } from "$lib/types";
import { Routes } from "./routes";


export const loginApi = async (fetch: Fetch, username: string, password: string): Promise<LoginResponse> => {

  const data = await fetch.request<LoginResponse>(Routes.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  })

  return data;
};

export const refreshTokenApi = async (fetch: Fetch): Promise<LoginResponse> => {

  const data = await fetch.request<LoginResponse>(Routes.AUTH.REFRESH, {
    method: "POST",
    credentials: 'include'
  })

  return data;
};