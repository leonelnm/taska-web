<script lang="ts">
	import { translate } from '$lib/i18n/errors';
	import ButtonLoading from './ButtonLoading.svelte';
	import InputPassword from './usuarios/InputPassword.svelte';

	interface Props {
		formErrors?: Record<string, string> | undefined;
	}

	let { formErrors }: Props = $props();

	let changingPassword = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	let passwordIsValid = $state(false);

	let formErrorsState: Record<string, string> = $state(formErrors ? { ...formErrors } : {});

	const handlePasswordValidation = (valid: boolean) => {
		passwordIsValid = valid;
	};

	const validate = () => {
		if (currentPassword === newPassword) {
			formErrorsState.currentPassword = 'error.password.same_as_current';
		}

		if (!passwordIsValid) {
			formErrorsState.password = 'error.password.invalid';
		}

		if (newPassword !== confirmPassword) {
			formErrorsState.password2 = 'error.password.mismatch';
		}

		return Object.keys(formErrorsState).length === 0;
	};

	const handleSubmit = (event: Event) => {
		changingPassword = true;
		formErrorsState = {};
		if (!validate()) {
			event.preventDefault();
			changingPassword = false;
			return;
		}
		changingPassword = false;
	};
</script>

<div
	class="w-full rounded-lg border-t-4 border-yellow-300 bg-yellow-50 p-4 text-yellow-800 shadow-sm sm:p-6 md:p-8"
>
	<div class="flex items-center gap-2">
		<svg
			class="h-4 w-4 shrink-0"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			<path
				d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
			/>
		</svg>
		<h2 class="text-lg font-medium">Cambiar Contraseña</h2>
	</div>

	<form class="space-y-5" method="POST" onsubmit={handleSubmit}>
		<div class="mt-4 space-y-2">
			<label for="currentPassword" class="block font-medium">Contraseña Actual</label>
			<input
				type="password"
				name="currentPassword"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={currentPassword}
				required
				autocomplete="off"
			/>
			{#if formErrorsState.currentPassword}
				<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.currentPassword)}
				</p>
			{/if}
		</div>

		<InputPassword
			label="Nueva Contraseña"
			inputName="newPassword"
			bind:password={newPassword}
			validationCallback={handlePasswordValidation}
			formErrors={formErrorsState}
		/>

		<div class="space-y-2">
			<label for="password2" class="block font-medium">Repetir Nueva Contraseña</label>
			<input
				type="password"
				name="password2"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={confirmPassword}
				required
				autocomplete="off"
			/>
			{#if formErrorsState.password2}
				<p class="mt-1 text-sm text-red-600">
					{translate(formErrorsState.password2)}
				</p>
			{/if}
		</div>

		<ButtonLoading
			type="submit"
			loading={changingPassword}
			label="Cambiar Contraseña"
			labelLoading="Cambiando contraseña..."
		/>
	</form>
</div>
