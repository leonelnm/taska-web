
import { Fetch } from "$lib/api/fetchClient";
import type { LoginResponse, ProfileResponse } from "$lib/types";
import { Routes } from "./routes";


export const loginApi = async (fetch: Fetch, username: string, password: string): Promise<LoginResponse> => {

  const data = await fetch.request<LoginResponse>(Routes.LOGIN, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    credentials: 'include'
  })

  return data;
};

export const profileApi = async (fetch: Fetch): Promise<ProfileResponse> => {

  return await fetch.request<ProfileResponse>(Routes.PROFILE)

}