<script lang="ts">
	import { dateToString } from '$lib/api/dateUtils';
	import type { UserResponse } from '$lib/types';
	import { enhance } from '$app/forms';

	interface Props {
		user: UserResponse;
	}

	let { user }: Props = $props();
</script>

<div
	class="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-100/60 p-4 transition-shadow hover:shadow-sm"
	class:opacity-60={!user.activo}
>
	<div class="flex flex-grow items-center gap-4">
		<div class="flex flex-grow flex-col gap-1">
			<div class="flex items-center gap-2">
				<h3 class="font-medium text-gray-900">{user.nombre || user.username}</h3>
				{#if user.admin}
					<span class="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
						Admin
					</span>
				{/if}
				<span
					class="rounded-full px-2 py-1 text-xs font-medium {user.activo
						? 'bg-green-100 text-green-800'
						: 'bg-red-100 text-red-800'}"
				>
					{user.activo ? 'Activo' : 'Inactivo'}
				</span>
			</div>
			<div class="space-y-1 text-sm text-gray-500">
				<p>Usuario: {user.username}</p>
				<p>Puesto: {user.puesto}</p>
				<p>Creado: {dateToString(user.fechaCreacion)}</p>
			</div>
		</div>

		<div class="flex flex-shrink-0 items-center">
			<form method="POST" action="?/{user.activo ? 'deactivate' : 'activate'}" use:enhance>
				<input type="hidden" name="username" value={user.username} />
				<button
					type="submit"
					class="inline-flex cursor-pointer items-center"
					aria-label={user.activo ? 'desactivar usuario' : 'activar usuario'}
				>
					<input type="checkbox" class="peer sr-only" readonly checked={user.activo} />
					<div
						class="peer relative h-7 w-14 rounded-full bg-gray-200 peer-checked:bg-green-500 peer-focus:ring-4 peer-focus:ring-green-300 peer-focus:outline-none after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
					></div>
				</button>
			</form>
		</div>
	</div>
</div>
