<script lang="ts">
	import { translate } from '$lib/i18n/errors';
	import { fly } from 'svelte/transition';

	interface Props {
		password: string;
		formErrors?: Record<string, string> | undefined;
		inputName?: string;
		validationCallback: (valid: boolean) => void;
	}

	let {
		password = $bindable(),
		formErrors,
		validationCallback,
		inputName = 'password'
	}: Props = $props();

	let isValid = $state(false);

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

		isValid = Object.values(validations).every((v) => v);

		validationCallback(isValid);
	};
</script>

<div class="space-y-2">
	<label for={inputName} class="block font-medium">Contraseña</label>
	<input
		type="password"
		name={inputName}
		class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
		bind:value={password}
		required
		autocomplete="off"
		oninput={handleChange}
	/>
	{#if password && !isValid}
		<ul class="text-xs" transition:fly={animationOptions}>
			<li class={validations.hasUppercase ? 'text-green-600' : 'text-red-600'}>
				Al menos una letra mayúscula
			</li>
			<li class={validations.hasLowercase ? 'text-green-600' : 'text-red-600'}>
				Al menos una letra minúscula
			</li>
			<li class={validations.hasNumber ? 'text-green-600' : 'text-red-600'}>Al menos un número</li>
			<li class={validations.minLength ? 'text-green-600' : 'text-red-600'}>Mínimo 8 caracteres</li>
		</ul>
	{/if}
	{#if formErrors && formErrors[inputName]}<p class="mt-1 text-sm text-red-600">
			{translate(formErrors[inputName])}
		</p>{/if}
	{#if formErrors && formErrors.password2}<p class="mt-1 text-sm text-red-600">
			{translate(formErrors.password2)}
		</p>{/if}
</div>
