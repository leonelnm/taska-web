import { UserApi } from "$lib/api/usuarioApi";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { CrearUserRequest } from "$lib/types";
import { fail } from "@sveltejs/kit";
import type { FetchError } from "$lib/api/fetchClient";

export const load: PageServerLoad = async ({ fetch }) => {

  const userApi = new UserApi(fetch)

  const users = await userApi.getUsers();

  return {
    users: users
      .sort((a, b) => a.username.localeCompare(b.username))
      .filter(u => u.username !== 'admin')
  }
};

export const actions: Actions = {
  create: async ({ request, fetch }) => {
    const fd = await request.formData();

    const username = String(fd.get('usuario') ?? '').trim();
    const puestoIdRaw = fd.get('puesto');
    const nombre = fd.get('nombre') ? String(fd.get('nombre')) : undefined;
    const password = String(fd.get('password') ?? '').trim();

    const errors: Record<string, string> = {};

    // Username
    if (!username) {
      errors.username = 'El usuario es obligatorio.';
    } else {
      if (username.length < 4) errors.username = 'El usuario debe tener al menos 4 caracteres.';
      else if (username.length > 20) errors.username = 'El usuario debe tener como máximo 20 caracteres.';
      else if (!/^[a-z0-9_-]*$/.test(username)) {
        errors.username = 'El usuario solo puede contener minúsculas, números, guiones bajos (_) y guiones (-).';
      }
    }

    // Puesto
    let puestoId: number | undefined = undefined;
    if (!puestoIdRaw) {
      errors.puesto = 'Selecciona un puesto.';
    } else {
      puestoId = Number(puestoIdRaw);
      if (Number.isNaN(puestoId)) {
        errors.puesto = 'El puesto no es válido.';
      }
    }

    // Password
    if (!password) {
      errors.password = 'La contraseña es obligatoria.';
    } else {
      if (password.length < 8) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres.';
      } else if (/\s/.test(password)) {
        errors.password = 'La contraseña no puede contener espacios.';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.password = 'La contraseña debe tener al menos una mayúscula, una minúscula y un número.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        data: { username, nombre, puestoId, password: '' },
        errors
      });
    }

    // Crear request
    const userRequest: CrearUserRequest = {
      username,
      password,
      nombre,
      puestoId: puestoId!
    };

    const userApi = new UserApi(fetch);

    try {
      await userApi.createUser(userRequest);
    } catch (error) {
      const err = error as FetchError;

      if (err.response?.status === 400) {
        return fail(400, {
          data: { username, nombre, puestoId },
          errors: { ...err.details }
        });
      }

      return fail(500, { message: 'Error inesperado al crear usuario.' });
    }

    return { success: true };
  },

  activate: async ({ request, fetch }) => {
    const data = await request.formData();
    const username = data.get("username") as string;

    if (!username) {
      return fail(400, { message: 'Username requerido' });
    }

    const userApi = new UserApi(fetch);

    try {
      const success = await userApi.activateUser(username);
      if (success) {
        return { success: true, action: 'activate', username };
      } else {
        return fail(400, { message: 'Error activando usuario' });
      }
    } catch (error) {
      console.error('Error activating user:', error);
      return fail(500, { message: 'Error interno del servidor' });
    }
  },

  deactivate: async ({ request, fetch }) => {
    const data = await request.formData();
    const username = data.get("username") as string;

    if (!username) {
      return fail(400, { message: 'Username requerido' });
    }

    const userApi = new UserApi(fetch);

    try {
      const success = await userApi.deactivateUser(username);
      if (success) {
        return { success: true, action: 'deactivate', username };
      } else {
        return fail(400, { message: 'Error desactivando usuario' });
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      return fail(500, { message: 'Error interno del servidor' });
    }
  }
};
