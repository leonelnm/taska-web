import { UserApi } from "$lib/api/usuarioApi";
import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { CrearUserRequest } from "$lib/types";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ fetch }) => {

  const userApi = new UserApi(fetch)

  const users = await userApi.getUsers();

  return {
    users
  }
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
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
      return fail(400, { errors });
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
      console.error(error);
      return fail(500, { message: 'Error inesperado al crear usuario.' });
    }

    return { success: true };
  }
};
