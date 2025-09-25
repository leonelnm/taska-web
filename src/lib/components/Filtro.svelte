<script lang="ts">
	import { getDiasSemana, getRecurrences } from '$lib/api/utils';
	import { fly } from 'svelte/transition';
	import type { FiltroTareaRequest, Puesto, Turno } from '$lib/types';
	import SelectField from './SelectField.svelte';
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { nowPlusYearToString } from '$lib/api/dateUtils';
	import type { SubmitFunction } from '@sveltejs/kit';

	interface Props {
		collapsed?: boolean;
		puestos: Puesto[];
		turnos: Turno[];
		filtroState?: FiltroTareaRequest;
		isAdmin?: boolean;
		loading?: boolean;
	}

	let {
		puestos,
		turnos,
		filtroState,
		isAdmin = false,
		loading = $bindable(false)
	}: Props = $props();

	const animationOptions = { duration: 100 };
	const maxDate = nowPlusYearToString();

	const recurrencias = getRecurrences();

	const diasSemana = getDiasSemana();

	const completadaOptions = [
		{ label: 'Sí', value: true },
		{ label: 'No', value: false }
	];

	const initialStateFilter: FiltroTareaRequest = {
		turnoId: undefined,
		puestoId: undefined,
		tipoRecurrencia: undefined,
		diaSemana: undefined,
		completada: undefined,
		fechaInicio: undefined,
		fechaFin: undefined
	};

	let isCollapsed = $state(
		!filtroState ||
			Object.entries(filtroState).every(
				([key, value]) => value === initialStateFilter[key as keyof FiltroTareaRequest]
			)
	);

	let filtro: FiltroTareaRequest = $state({
		...initialStateFilter,
		...filtroState
	});
	let isSearching = $state(false);

	let errors: Record<string, string> = $state({});

	$effect(() => {
		loading = isSearching;
	});

	const showMessageFechas = $derived.by(
		() => filtro.fechaInicio === undefined && filtro.fechaFin === undefined
	);

	const handleReset = async (event: Event) => {
		event.preventDefault();
		filtro = { ...initialStateFilter };
		errors = {};
	};

	const handleClose = () => {
		isCollapsed = !isCollapsed;
	};

	const validate = () => {
		// Validar que la fecha de inicio no sea posterior a la fecha de fin
		if (filtro.fechaInicio && filtro.fechaFin) {
			if (filtro.fechaInicio > filtro.fechaFin) {
				errors.fechaFin = 'La fecha de fin no puede ser anterior a la fecha de inicio.';
				return false;
			}
		}
		return true;
	};

	const enhanceSubmit: SubmitFunction = ({ cancel }) => {
		isSearching = true;

		if (!validate()) {
			isSearching = false;
			cancel();
		}

		return async ({ result }) => {
			await invalidateAll();

			if (result.type === 'success') {
				const { params } = result.data as {
					params: string;
				};

				await goto('?' + params, {
					replaceState: true
				});
			}
			isSearching = false;
		};
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<div class="flex items-center justify-between">
		<h5 class="text-xl font-medium text-gray-900">Buscador</h5>
		<button
			type="button"
			class="ml-auto rounded-lg p-1.5 text-gray-400 transition-transform duration-200 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 focus:outline-none {isCollapsed
				? ''
				: 'rotate-180'}"
			aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
			tabindex="-1"
			onclick={handleClose}
		>
			<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		</button>
	</div>
	{#if !isCollapsed}
		<form
			method="POST"
			action="?/filter"
			class="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-2 2xl:flex"
			onreset={handleReset}
			in:fly={{ ...animationOptions, y: -10 }}
			out:fly={{ ...animationOptions, y: -10 }}
			use:enhance={enhanceSubmit}
		>
			{#if isAdmin}
				<div class="space-y-2">
					<div class="space-y-2 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
						<div class="basis-xs space-y-0.5">
							<label for="fecha-inicio" class="block text-xs font-medium text-gray-700"
								>Fecha Inicio</label
							>
							<div class="flex-col">
								<input
									type="date"
									id="fecha-inicio"
									name="fechaInicio"
									min="2025-09-01"
									max={maxDate}
									bind:value={filtro.fechaInicio}
									class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>
							</div>
						</div>

						<div class="basis-xs space-y-0.5">
							<label for="fecha-fin" class="block text-xs font-medium text-gray-700"
								>Fecha Fin</label
							>
							<div class="flex-col">
								<input
									type="date"
									id="fecha-fin"
									name="fechaFin"
									min="2025-09-01"
									max={maxDate}
									bind:value={filtro.fechaFin}
									class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
								/>
							</div>
						</div>
					</div>
					{#if showMessageFechas}
						<p class="text-xs text-gray-500">
							* Si no se selecciona ninguna fecha, se buscará en todas las fechas.
						</p>
					{/if}
					{#if errors.fechaFin}
						<p class="text-xs text-red-500">
							{errors.fechaFin}
						</p>
					{/if}
				</div>
			{/if}

			<SelectField
				label="Turno"
				name="turnoId"
				bind:value={filtro.turnoId}
				options={turnos}
				valueKey="id"
			/>

			{#if isAdmin}
				<SelectField
					label="Puesto"
					name="puestoId"
					bind:value={filtro.puestoId}
					options={puestos}
					valueKey="id"
				/>
			{/if}

			<SelectField
				label="Recurrencia"
				name="tipoRecurrencia"
				bind:value={filtro.tipoRecurrencia}
				options={recurrencias}
				valueKey="recurrenceType"
			/>

			<SelectField
				label="Día de la semana"
				name="diaSemana"
				bind:value={filtro.diaSemana}
				options={diasSemana}
				valueKey="diaSemana"
			/>

			<SelectField
				label="Completada"
				name="completada"
				bind:value={filtro.completada}
				options={completadaOptions}
				valueKey="value"
			/>

			<div class="flex justify-end gap-3 sm:flex-row-reverse sm:justify-start">
				<button
					type="reset"
					class="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 focus:outline-none disabled:bg-gray-50 disabled:text-gray-300"
					onclick={(e) => e.currentTarget.blur()}
					disabled={isSearching}
				>
					Limpiar
				</button>

				<button
					type="submit"
					class="over:bg-amber-700 inline-flex items-center rounded-lg bg-amber-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none invalid:focus:ring-red-500 disabled:bg-amber-900"
					onclick={(e) => e.currentTarget.blur()}
					disabled={isSearching}
				>
					Buscar
				</button>
			</div>
		</form>
	{/if}
</div>
