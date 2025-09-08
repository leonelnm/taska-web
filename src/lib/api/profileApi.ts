import { Fetch } from '$lib/api/fetchClient';
import type { ChangePasswordRequest, ProfileResponse } from "$lib/types";
import { Routes } from '$lib/api/routes';

export class ProfileApi {
  private fetch: Fetch;

  constructor(fetchFn: typeof window.fetch) {
    this.fetch = new Fetch(fetchFn);
  }

  // GET /profile/me
  public async getProfile(): Promise<ProfileResponse> {
    try {
      return await this.fetch.request<ProfileResponse>(Routes.PROFILE.BASE);
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  // POST /profile/me
  public async changePassword(data: ChangePasswordRequest): Promise<boolean> {
    try {
      await this.fetch.request<void>(Routes.PROFILE.CHANGE_PASSWORD, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  }
}