<script lang="ts">
	import type { Puesto } from '$lib/types';
	import CardCollapse from '$lib/components/CardCollapse.svelte';
	import { translate } from '$lib/i18n/errors';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { fly } from 'svelte/transition';

	interface Props {
		puestos: Puesto[];
		data?: Record<string, any> | undefined;
		formErrors?: Record<string, string> | undefined;
	}

	let { puestos, formErrors, data }: Props = $props();

	let username = $state(data?.username || '');
	let name = $state(data?.nombre || '');
	let puesto = $state(data?.puestoId || '');
	let password = $state('');
	let password2 = $state('');

	let creating = $state(false);
	let formErrorsState: Record<string, string> = $state(formErrors ? { ...formErrors } : {});
	let formMessage: string | undefined = $state(undefined);
	let formSuccess: string | undefined = $state(undefined);

	let showPasswordValidations = $state(false);

	const animationOptions = { duration: 100, y: -10 };

	const validations = $state({
		minLength: false,
		hasUppercase: false,
		hasLowercase: false,
		hasNumber: false
	});

	const handleChange = () => {
		const minLength = 8;
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);

		validations.minLength = password.length >= minLength;
		validations.hasUppercase = hasUppercase;
		validations.hasLowercase = hasLowercase;
		validations.hasNumber = hasNumber;

		showPasswordValidations = Object.values(validations).some((v) => !v);
	};

	const handleUsername = () => {
		if (username) {
			return;
		}

		let normalized = name.trim().toLowerCase();
		normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		const words = normalized.split(/\s+/);
		const firstWord = words[0] || '';

		let generated = firstWord;

		let minUsernameLength = 4;
		if (firstWord.length < minUsernameLength && words.length > 1) {
			const secondWord = words[1] || '';
			generated = (firstWord + secondWord).slice(0, minUsernameLength);
		}

		while (generated.length < 4) {
			generated += '0';
		}

		username = generated;
	};

	const validateForm = () => {
		formErrorsState = {};
		formMessage = undefined;

		// Nombre
		if (!name.trim()) {
			formErrorsState.name = 'error.username.required';
		}

		// Username
		if (!username.trim()) {
			formErrorsState.username = 'error.username.required';
		} else {
			if (username.length < 4) {
				formErrorsState.username = 'error.username.min_length';
			} else if (username.length > 20) {
				formErrorsState.username = 'error.username.max_length';
			} else if (!/^[a-z0-9_-]*$/.test(username)) {
				formErrorsState.username = 'error.username.invalid_chars';
			}
		}

		// Puesto
		if (!puesto) {
			formErrorsState.puesto = 'error.puesto.required';
		}

		// Password
		if (!password) {
			formErrorsState.password = 'error.password.required';
		} else {
			if (password.length < 8) {
				formErrorsState.password = 'error.password.min_length';
			} else if (/\s/.test(password)) {
				formErrorsState.password = 'error.password.no_spaces';
			} else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
				formErrorsState.password = 'error.password.complexity';
			}
		}

		console.log({ password, password2 });

		// Confirmación de contraseña
		if (password !== password2) {
			formErrorsState.password2 = 'error.password.mismatch';
		}

		return Object.keys(formErrorsState).length === 0;
	};

	const enhanceSubmit: SubmitFunction = () => {
		creating = true;

		resetErrors();
		if (!validateForm()) {
			formMessage = 'Por favor, corrige los errores en el formulario.';
			creating = false;
			return;
		}

		return async ({ result, update }) => {
			if (result.type === 'failure') {
				formErrorsState = result.data?.errors ?? {};
				formMessage = result.data?.message ?? 'Error al crear el usuario.';
			} else if (result.type === 'success') {
				formSuccess = 'Usuario creado correctamente.';
			}

			await update();
			creating = false;
		};
	};

	const resetErrors = () => {
		console.log('limpiando errores');
		console.log('passwords', password, password2);

		formErrorsState = {};
		formMessage = undefined;
	};
</script>

<CardCollapse title="Crear Usuario" collapsed={false}>
	<form class="space-y-5" method="POST" use:enhance={enhanceSubmit}>
		{#if formSuccess}
			<div class="rounded-md bg-green-50 p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-green-800">{formSuccess}</h3>
					</div>
				</div>
			</div>
		{/if}

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
			{#if formErrorsState.name}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.name)}
				</p>{/if}
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
			{#if formErrorsState.username}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.username)}
				</p>{/if}
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
			{#if formErrorsState.puesto}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.puesto)}
				</p>{/if}
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
				oninput={handleChange}
			/>
			{#if showPasswordValidations}
				<ul class="text-xs" transition:fly={animationOptions}>
					<li class={validations.hasUppercase ? 'text-green-600' : 'text-red-600'}>
						Al menos una letra mayúscula
					</li>
					<li class={validations.hasLowercase ? 'text-green-600' : 'text-red-600'}>
						Al menos una letra minúscula
					</li>
					<li class={validations.hasNumber ? 'text-green-600' : 'text-red-600'}>
						Al menos un número
					</li>
					<li class={validations.minLength ? 'text-green-600' : 'text-red-600'}>
						Mínimo 8 caracteres
					</li>
				</ul>
			{/if}
			{#if formErrorsState.password}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.password)}
				</p>{/if}
			{#if formErrorsState.password2}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.password2)}
				</p>{/if}
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
			{#if formErrorsState.password2}<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.password2)}
				</p>{/if}
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
