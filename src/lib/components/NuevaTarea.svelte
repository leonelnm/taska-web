<script lang="ts">
	import { getRecurrences } from '$lib/api/utils';
	import { RecurrenceType, type CrearTareaRequest, type Puesto, type Turno } from '$lib/types';
	import { fly } from 'svelte/transition';

	interface Props {
		puestos: Puesto[];
		turnos: Turno[];
	}
	let { puestos, turnos }: Props = $props();

	const animationOptions = { duration: 100 };

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

	const handleSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const fd = new FormData(form);

		const payload: CrearTareaRequest = {
			puestoId: Number(fd.get('puesto')),
			turnoId: Number(fd.get('turno')),
			descripcion: String(fd.get('descripcion')),
			tipoRecurrencia: recurrenciaSelected,
			diaSemana: (fd.get('diaSemana') as CrearTareaRequest['diaSemana']) ?? undefined,
			diaMes: fd.get('diaMes') ? Number(fd.get('diaMes')) : undefined,
			fecha: fd.get('fecha') ? String(fd.get('fecha')) : undefined
		};

		// crearTarea(payload)
		// 	.then((tarea) => {
		// 		form.reset();
		// 		recurrenciaSelected = recurrencias[0].recurrenceType;
		// 	})
		// 	.catch((error) => {
		// 		console.error('Error creando tarea:', error);
		// 	});
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
		onsubmit={handleSubmit}
		in:fly={{ ...animationOptions, y: -10 }}
		out:fly={{ ...animationOptions, y: -10 }}
	>
		<div class="space-y-2">
			<label for="descripcion" class="block font-medium text-gray-700">Descripción</label>
			<textarea
				id="descripcion"
				name="descripcion"
				rows="3"
				placeholder="Describe la tarea a realizar..."
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				required
			></textarea>
		</div>

		<div class="space-y-2">
			<label for="puesto" class="block font-medium text-gray-700">Puesto</label>
			<select
				id="puesto"
				name="puesto"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				required
			>
				<option value="" disabled selected>Selecciona un puesto</option>
				{#each puestos as puesto}
					<option value={puesto.id}>{puesto.label}</option>
				{/each}
			</select>
		</div>

		<div class="space-y-2">
			<label for="turno" class="block font-medium text-gray-700">Turno</label>
			<select
				id="turno"
				name="turno"
				class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				required
			>
				<option value="" disabled selected>Selecciona un turno</option>
				{#each turnos as turno}
					<option value={turno.id}>{turno.label}</option>
				{/each}
			</select>
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
									? 'bg-blue-700  text-white hover:bg-blue-800 focus:ring-blue-300'
									: 'bg-gray-100  text-gray-800 hover:bg-gray-200 focus:ring-gray-300'
							}
						`}
					>
						{recurrencia.label}
					</button>
				{/each}
			</div>
		</div>

		{#if mostrarDiaSemana}
			<div class="space-y-2" in:fly={animationOptions}>
				<label for="diaSemana" class="block font-medium text-gray-700">Día de la semana</label>
				<select
					id="diaSemana"
					name="diaSemana"
					class="w-full rounded-md border border-gray-300 px-3 py-2.5 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					<option value="LUNES">Lunes</option>
					<option value="MARTES">Martes</option>
					<option value="MIERCOLES">Miércoles</option>
					<option value="JUEVES">Jueves</option>
					<option value="VIERNES">Viernes</option>
					<option value="SABADO">Sábado</option>
					<option value="DOMINGO">Domingo</option>
				</select>
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
					class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{/if}

		{#if mostrarFecha}
			<div class="space-y-2" in:fly={animationOptions}>
				<label for="fecha" class="block font-medium text-gray-700">Fecha</label>
				<input
					type="date"
					id="fecha"
					name="fecha"
					class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{/if}

		<button
			type="submit"
			class="w-full rounded-md bg-blue-600 py-3 font-medium text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
		>
			Guardar Tarea
		</button>
	</form>
</div>
