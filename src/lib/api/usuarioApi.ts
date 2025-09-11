import { Fetch } from '$lib/api/fetchClient';
import { Routes } from '$lib/api/routes';
import type { CrearUserRequest, UserResponse } from '$lib/types';

export class UserApi {
  private fetch: Fetch;

  constructor(fetchFn: typeof window.fetch) {
    this.fetch = new Fetch(fetchFn);
  }

  // GET /users
  public async getUsers(): Promise<UserResponse[]> {
    try {
      return await this.fetch.request<UserResponse[]>(Routes.USERS.BASE);
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }

  // POST /users
  public async createUser(data: CrearUserRequest): Promise<UserResponse | undefined> {
    try {
      return await this.fetch.request<UserResponse>(Routes.USERS.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  // POST /users/password
  public async changePassword(username: string, password: string): Promise<boolean> {
    try {
      await this.fetch.request<void>(Routes.USERS.CHANGE_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      return true;
    } catch (error) {
      console.error("Error changing password:", error);
      return false;
    }
  }

  // PUT /users/{username}/activar
  public async activateUser(username: string): Promise<boolean> {
    try {
      await this.fetch.request<void>(Routes.USERS.ACTIVATE(username), { method: "PUT" });
      return true;
    } catch (error) {
      console.error("Error activating user:", error);
      return false;
    }
  }

  // PUT /users/{username}/desactivar
  public async deactivateUser(username: string): Promise<boolean> {
    try {
      await this.fetch.request<void>(Routes.USERS.DEACTIVATE(username), { method: "PUT" });
      return true;
    } catch (error) {
      console.error("Error deactivating user:", error);
      return false;
    }
  }
}