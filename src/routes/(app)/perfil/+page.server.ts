import type { FetchError } from "$lib/api/fetchClient";
import { ProfileApi } from "$lib/api/profileApi";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const fd = await request.formData();

    const currentPassword = String(fd.get('currentPassword') ?? '').trim();
    const newPassword = String(fd.get('newPassword') ?? '').trim();
    const errors: Record<string, string> = {};

    if (!currentPassword) {
      errors.currentPassword = 'La contraseña actual es obligatoria.';
    }

    if (!newPassword) {
      errors.newPassword = 'La nueva contraseña es obligatoria.';
    } else {
      if (newPassword.length < 8) {
        errors.newPassword = 'La nueva contraseña debe tener al menos 8 caracteres.';
      } else if (/\s/.test(newPassword)) {
        errors.newPassword = 'La nueva contraseña no puede contener espacios.';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        errors.newPassword = 'La nueva contraseña debe tener al menos una mayúscula, una minúscula y un número.';
      }
    }

    if (Object.keys(errors).length > 0) {
      return fail(400, {
        message: 'Error al cambiar la contraseña.',
        errors: { ...errors }
      });
    }

    const profileApi = new ProfileApi(fetch);

    try {
      await profileApi.changePassword({
        currentPassword,
        newPassword
      });
    } catch (error) {
      const err = error as FetchError;

      if (err.response?.status === 400) {
        return fail(400, {
          message: 'Error al cambiar la contraseña.',
          errors: { ...err.details }
        });
      }

      return fail(500, {
        message: 'Error inesperado al cambiar la contraseña.',
        errors: { general: 'Error inesperado al cambiar la contraseña.' }
      });
    }

    return { success: true };
  }
};