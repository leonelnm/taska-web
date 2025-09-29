<script lang="ts">
	import { enhance } from '$app/forms';
	import ButtonLoading from '$lib/components/ButtonLoading.svelte';
	import { translate } from '$lib/i18n/errors';

	let { form } = $props();

	let accediendo = $state(false);
	let mostrarError = $state(true);

	$effect(() => {
		if (form?.error) {
			mostrarError = true;
		}
	});
</script>

<div class="flex h-svh flex-col justify-center p-8">
	<form
		method="POST"
		class="mx-auto mb-40 w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
		use:enhance={() => {
			// Ocultar el error antes de enviar
			mostrarError = false;
			accediendo = true;
			return async ({ update, result }) => {
				if (result.type !== 'redirect') {
					accediendo = false;
				}
				await update();
			};
		}}
	>
		<div class="mb-12 flex flex-col items-center justify-center gap-2 text-amber-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-14"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>

			<h1 class="self-center text-3xl font-semibold whitespace-nowrap">Taska</h1>
		</div>

		<div class="mb-5">
			<label for="username" class="mb-2 block text-sm font-medium text-gray-900">Usuario</label>
			<input
				type="text"
				id="username"
				name="username"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 lowercase focus:border-blue-500 focus:ring-blue-500"
				placeholder="usuario"
				required
				autocomplete="off"
			/>
		</div>
		<div class="mb-5">
			<label for="password" class="mb-2 block text-sm font-medium text-gray-900">Contraseña</label>
			<input
				type="password"
				name="password"
				id="password"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				required
				placeholder="••••••••"
			/>
		</div>

		{#if form?.error && mostrarError}
			<div class="text-center text-sm text-red-600">
				{translate(form.error)}
			</div>
		{/if}

		<ButtonLoading
			type="submit"
			loading={accediendo}
			label="Acceder"
			labelLoading="Iniciando sesión"
		/>
	</form>
</div>
