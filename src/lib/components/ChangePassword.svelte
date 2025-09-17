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

		console.log(newPassword, confirmPassword);

		if (newPassword !== confirmPassword) {
			formErrorsState.password2 = 'error.password.mismatch';
		}

		return Object.keys(formErrorsState).length === 0;
	};

	const handleSubmit = (event: Event) => {
		console.log('INIT cambiando contraseña');
		changingPassword = true;
		formErrorsState = {};
		if (!validate()) {
			event.preventDefault();
			changingPassword = false;
			return;
		}

		console.log('END cambiando contraseña');

		changingPassword = false;
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<h2 class="text-lg font-medium">Cambiar Contraseña</h2>

	<form class="space-y-5" method="POST" onsubmit={handleSubmit}>
		<div class="mt-4 space-y-2">
			<label for="currentPassword" class="block font-medium text-gray-700">Contraseña Actual</label>
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
			inputName="newPassword"
			bind:password={newPassword}
			validationCallback={handlePasswordValidation}
			formErrors={formErrorsState}
		/>

		<div class="space-y-2">
			<label for="password2" class="block font-medium text-gray-700">Repetir Contraseña</label>
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
