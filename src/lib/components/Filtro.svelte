<script lang="ts">
	import { getDiasSemana, getRecurrences } from '$lib/api/utils';
	import { fly } from 'svelte/transition';
	import type { FiltroTareaRequest, Puesto, Turno } from '$lib/types';
	import SelectField from './SelectField.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	interface Props {
		collapsed?: boolean;
		puestos: Puesto[];
		turnos: Turno[];
		filtroState?: FiltroTareaRequest;
		isAdmin?: boolean;
	}

	let { puestos, turnos, filtroState, collapsed = true, isAdmin = false }: Props = $props();

	const animationOptions = { duration: 100 };

	const initialStateFilter: FiltroTareaRequest = {
		turnoId: undefined,
		puestoId: undefined,
		tipoRecurrencia: undefined,
		diaSemana: undefined,
		completada: undefined
	};

	let isCollapsed = $state(
		!filtroState ||
			Object.entries(filtroState).every(
				([key, value]) => value === initialStateFilter[key as keyof FiltroTareaRequest]
			)
	);

	const recurrencias = getRecurrences();

	const diasSemana = getDiasSemana();

	const completadaOptions = [
		{ label: 'Sí', value: true },
		{ label: 'No', value: false }
	];

	let filtro: FiltroTareaRequest = $state({
		...initialStateFilter,
		...filtroState
	});
	let isSearching = $state(false);

	const handleReset = async (event: Event) => {
		event.preventDefault();
		filtro = { ...initialStateFilter };
	};

	const handleClose = () => {
		isCollapsed = !isCollapsed;
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
			class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:flex"
			onreset={handleReset}
			in:fly={{ ...animationOptions, y: -10 }}
			out:fly={{ ...animationOptions, y: -10 }}
			use:enhance={() => {
				isSearching = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						const { params } = result.data as {
							params: string;
						};

						goto('?' + params, {
							replaceState: true
						});
					}
					isSearching = false;
				};
			}}
		>
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
					class="inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none disabled:bg-blue-300"
					onclick={(e) => e.currentTarget.blur()}
					disabled={isSearching}
				>
					Buscar
				</button>
			</div>
		</form>
	{/if}
</div>
