<script lang="ts">
	import { enhance } from '$app/forms';
	import { getRecurrences } from '$lib/api/utils';
	import { RecurrenceType, type Puesto, type Turno } from '$lib/types';
	import { fade, fly } from 'svelte/transition';
	import ButtonLoading from './ButtonLoading.svelte';

	interface Props {
		puestos: Puesto[];
		turnos: Turno[];
		error?: string | undefined;
	}

	let { puestos, turnos, error }: Props = $props();

	const animationOptions = { duration: 100 };
	const descriptionMaxLenght = 100;

	let recurrencias = getRecurrences();

	let recurrenciaSelected = $state<RecurrenceType>(recurrencias[0].recurrenceType);

	let mostrarDiaSemana = $derived(
		[RecurrenceType.SEMANAL, RecurrenceType.QUINCENAL].includes(recurrenciaSelected)
	);
	let mostrarDiaMes = $derived(recurrenciaSelected === RecurrenceType.MENSUAL);
	let mostrarFecha = $derived(recurrenciaSelected === RecurrenceType.UNA_VEZ);

	const seleccionarRecurrencia = (recurrencia: RecurrenceType) => {
		recurrenciaSelected = recurrencia;
	};

	let descripcion = $state('');
	let puesto = $state('');
	let turno = $state('');
	let diaSemana = $state('');
	let diaMes = $state<number | undefined>();
	let fecha = $state('');

	let formErrors = $state<{ [key: string]: string | undefined }>({});
	let formMessage = $state<string | undefined>();

	let remaining = $derived(descriptionMaxLenght - descripcion.length);
	let showRemaining = $derived(remaining < 40);
	let showErrorRemaining = $derived(remaining < 0);

	let creating = $state(false);
	let created = $state(false);

	const validateForm = () => {
		formErrors = {};
		formMessage = undefined;
		if (!descripcion) formErrors.descripcion = 'La descripción es obligatoria.';
		if (!puesto) formErrors.puesto = 'El puesto es obligatorio.';
		if (!turno) formErrors.turno = 'El turno es obligatorio.';
		if (showErrorRemaining) formErrors.error = 'La descripción es muy larga.';

		switch (recurrenciaSelected) {
			case RecurrenceType.SEMANAL:
			case RecurrenceType.QUINCENAL:
				if (!diaSemana)
					formErrors.diaSemana = 'El día de la semana es obligatorio para esta recurrencia.';
				break;
			case RecurrenceType.MENSUAL:
				if (!diaMes) formErrors.diaMes = 'El día del mes es obligatorio para esta recurrencia.';
				break;
			case RecurrenceType.UNA_VEZ:
				if (!fecha) formErrors.fecha = 'La fecha es obligatoria para esta recurrencia.';
				break;
		}

		return Object.keys(formErrors).length === 0;
	};

	const handleSubmit = (event: Event) => {
		if (!validateForm()) {
			event.preventDefault();
			formMessage = 'Por favor, corrige los errores en el formulario.';
		}
	};
</script>

<div
	class="w-full space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
>
	<div class="flex items-center justify-between">
		<h5 class="text-xl font-medium text-gray-900">Crear Tarea</h5>
	</div>

	<form
		class="space-y-5"
		method="POST"
		onsubmit={handleSubmit}
		in:fade={animationOptions}
		use:enhance={() => {
			creating = true;
			created = false;
			return async ({ result, update }) => {
				if (result.type === 'success') {
					created = true;
				}
				await update();
				creating = false;
			};
		}}
	>
		{#if formMessage}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">{formMessage}</h3>
					</div>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="rounded-md bg-red-50 p-4">
				<div class="flex">
					<div class="ml-3">
						<h3 class="text-sm font-medium text-red-800">{error}</h3>
					</div>
				</div>
			</div>
		{/if}

		{#if created}
			<div
				transition:fade={animationOptions}
				id="alert-3"
				class="mb-4 flex items-center rounded-lg bg-green-50 p-4 text-green-800"
				role="alert"
			>
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
				<span class="sr-only">Info</span>
				<div class="ms-3 text-sm font-medium">Tarea Creada</div>
				<button
					type="button"
					class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 p-1.5 text-green-500 hover:bg-green-200 focus:ring-2 focus:ring-green-400"
					data-dismiss-target="#alert-3"
					aria-label="Close"
					onclick={() => {
						created = false;
					}}
				>
					<span class="sr-only">Close</span>
					<svg
						class="h-3 w-3"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
						/>
					</svg>
				</button>
			</div>
		{/if}

		<div class="space-y-2">
			<label for="descripcion" class="block font-medium text-gray-700">Descripción</label>
			<div class="flex-col">
				<textarea
					id="descripcion"
					name="descripcion"
					rows="4"
					placeholder="Describe la tarea a realizar..."
					class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 invalid:focus:ring-red-500 {showErrorRemaining
						? 'border-red-300 focus:ring-red-500'
						: 'focus:ring-blue-500'} focus:outline-none"
					bind:value={descripcion}
					required
				></textarea>
				{#if showRemaining}
					<span
						transition:fade={animationOptions}
						class="mr-2 block text-right text-xs {showErrorRemaining
							? 'text-red-600'
							: 'text-gray-400'}">Max {descriptionMaxLenght} caractéres. (Quedan {remaining})</span
					>
				{/if}
			</div>
			{#if formErrors.descripcion}<p class="mt-1 text-sm text-red-600">
					{formErrors.descripcion}
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
			{#if formErrors.puesto}<p class="mt-1 text-sm text-red-600">{formErrors.puesto}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="turno" class="block font-medium text-gray-700">Turno</label>
			<select
				id="turno"
				name="turno"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
				bind:value={turno}
				required
			>
				<option value="" disabled selected>Selecciona un turno</option>
				{#each turnos as turno}
					<option value={turno.id}>{turno.label}</option>
				{/each}
			</select>
			{#if formErrors.turno}<p class="mt-1 text-sm text-red-600">{formErrors.turno}</p>{/if}
		</div>

		<div class="space-y-2">
			<label for="recurrencia" class="block font-medium text-gray-700">Recurrencia</label>
			<div id="recurrencia" class="flex flex-wrap gap-2" role="group" aria-labelledby="recurrencia">
				{#each recurrencias as recurrencia}
					<button
						type="button"
						onclick={() => seleccionarRecurrencia(recurrencia.recurrenceType)}
						class={`me-2 mb-2 rounded-full px-5 py-2.5 text-center text-sm font-medium transition-colors focus:ring-4 focus:outline-none
							${
								recurrenciaSelected === recurrencia.recurrenceType
									? 'bg-amber-600  text-white hover:bg-amber-800 focus:ring-amber-500'
									: 'bg-gray-100  text-gray-800 hover:bg-gray-200 focus:ring-gray-300'
							}
						`}
					>
						{recurrencia.label}
					</button>
				{/each}
			</div>
			<input hidden id="recurrencia" name="recurrencia" bind:value={recurrenciaSelected} />
		</div>

		{#if mostrarDiaSemana}
			<div class="space-y-2" in:fly={animationOptions}>
				<label for="diaSemana" class="block font-medium text-gray-700">Día de la semana</label>
				<select
					id="diaSemana"
					name="diaSemana"
					class="w-full rounded-md border border-gray-300 px-3 py-2.5 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
					bind:value={diaSemana}
					required={mostrarDiaSemana}
				>
					<option value="LUNES">Lunes</option>
					<option value="MARTES">Martes</option>
					<option value="MIERCOLES">Miércoles</option>
					<option value="JUEVES">Jueves</option>
					<option value="VIERNES">Viernes</option>
					<option value="SABADO">Sábado</option>
					<option value="DOMINGO">Domingo</option>
				</select>
				{#if formErrors.diaSemana}<p class="mt-1 text-sm text-red-600">
						{formErrors.diaSemana}
					</p>{/if}
			</div>
		{/if}

		{#if mostrarDiaMes}
			<div class="space-y-2" in:fly={animationOptions}>
				<label for="diaMes" class="block font-medium text-gray-700">Día del mes</label>
				<input
					type="number"
					id="diaMes"
					name="diaMes"
					min="1"
					max="31"
					placeholder="Ej: 15"
					class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
					bind:value={diaMes}
					required={mostrarDiaMes}
				/>
				{#if formErrors.diaMes}<p class="mt-1 text-sm text-red-600">{formErrors.diaMes}</p>{/if}
			</div>
		{/if}

		{#if mostrarFecha}
			<div class="space-y-2" in:fly={animationOptions}>
				<label for="fecha" class="block font-medium text-gray-700">Fecha</label>
				<input
					type="date"
					id="fecha"
					name="fecha"
					class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none invalid:focus:ring-red-500"
					bind:value={fecha}
					required={mostrarFecha}
				/>
				{#if formErrors.fecha}<p class="mt-1 text-sm text-red-600">{formErrors.fecha}</p>{/if}
			</div>
		{/if}

		<ButtonLoading
			type="submit"
			loading={creating}
			label="Guardar Tarea"
			labelLoading="Guardando Tarea"
		/>
	</form>
</div>
