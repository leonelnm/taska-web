<script lang="ts">
	import type { Puesto } from '$lib/types';
	import CardCollapse from '$lib/components/CardCollapse.svelte';

	interface Props {
		puestos: Puesto[];
	}

	let { puestos }: Props = $props();

	let username = $state('');
	let name = $state('');
	let puesto = $state('');
	let password = $state('');
	let password2 = $state('');

	let creating = $state(false);

	let formErrors: Record<string, string> = $state({});
	let formMessage: string | undefined = $state(undefined);

	const handleUsername = () => {
		if (username) {
			return;
		}

		let normalized = name.trim().toLowerCase();
		normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		const firstWord = normalized.split(/\s+/)[0];
		username = firstWord;
	};

	const validateForm = () => {
		formErrors = {};
		formMessage = undefined;

		// Nombre
		if (!name.trim()) {
			formErrors.name = 'El nombre es obligatorio.';
		}

		// Username
		if (!username.trim()) {
			formErrors.username = 'El usuario es obligatorio.';
		} else {
			if (username.length < 4) formErrors.username = 'El usuario debe tener al menos 4 caracteres.';
			else if (username.length > 20)
				formErrors.username = 'El usuario debe tener como máximo 20 caracteres.';
			else if (!/^[a-z0-9_-]*$/.test(username)) {
				formErrors.username =
					'El usuario solo puede contener minúsculas, números, guiones bajos (_) y guiones (-).';
			}
		}

		// Puesto
		if (!puesto) {
			formErrors.puesto = 'El puesto es obligatorio.';
		}

		// Password
		if (!password) {
			formErrors.password = 'La contraseña es obligatoria.';
		} else {
			if (password.length < 8) {
				formErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
			} else if (/\s/.test(password)) {
				formErrors.password = 'La contraseña no puede contener espacios.';
			} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
				formErrors.password =
					'La contraseña debe tener al menos una mayúscula, una minúscula y un número.';
			}
		}

		// Confirmación de contraseña
		if (password !== password2) {
			formErrors.password2 = 'Las contraseñas no coinciden.';
		}

		return Object.keys(formErrors).length === 0;
	};

	const handleSubmit = (event: Event) => {
		if (!validateForm()) {
			event.preventDefault();
			formMessage = 'Por favor, corrige los errores en el formulario.';
			return;
		}
	};
</script>

<CardCollapse title="Crear Usuario" collapsed={false}>
	<form class="space-y-5" method="POST" onsubmit={handleSubmit}>
		{#if formMessage}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">{formMessage}</h3>
					</div>
				</div>
			</div>
		{/if}

		<div class="space-y-2">
			<label for="nombre" class="block font-medium text-gray-700">Nombre y apellido</label>
			<input
				onchange={handleUsername}
				name="nombre"
				placeholder="Nombre Apellido"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={name}
				required
				autocomplete="off"
			/>
			{#if formErrors.name}<p class="mt-1 text-sm text-red-600">{formErrors.name}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="usuario" class="block font-medium text-gray-700">Usuario</label>
			<input
				name="usuario"
				placeholder="usuario"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={username}
				required
				autocomplete="off"
			/>
			{#if formErrors.username}<p class="mt-1 text-sm text-red-600">{formErrors.username}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="puesto" class="block font-medium text-gray-700">Puesto</label>
			<select
				id="puesto"
				name="puesto"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={puesto}
				required
			>
				<option value="" disabled selected>Selecciona un puesto</option>
				{#each puestos as puesto}
					<option value={puesto.id}>{puesto.label}</option>
				{/each}
			</select>
			{#if formErrors.puesto}<p class="mt-1 text-sm text-red-600">{formErrors.puesto}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="password" class="block font-medium text-gray-700">Contraseña</label>
			<input
				type="password"
				name="password"
				placeholder="password"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={password}
				required
				autocomplete="off"
			/>
			{#if formErrors.password}<p class="mt-1 text-sm text-red-600">{formErrors.password}</p>{/if}
			{#if formErrors.password2}<p class="mt-1 text-sm text-red-600">{formErrors.password2}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="password2" class="block font-medium text-gray-700">Repetir Contraseña</label>
			<input
				type="password"
				name="password2"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={password2}
				required
				autocomplete="off"
			/>
			{#if formErrors.password2}<p class="mt-1 text-sm text-red-600">{formErrors.password2}</p>{/if}
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-blue-600 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none invalid:focus:ring-red-500 disabled:bg-blue-300"
			disabled={creating}
		>
			Crear Usuario
		</button>
	</form>
</CardCollapse>
