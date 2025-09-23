<script lang="ts">
	import { RecurrenceType, type TareaApp } from '$lib/types';
	import { getUserIsAdmin } from '$lib/context';
	import { getDayName, isBeforeToday } from '$lib/api/dateUtils';
	import { fade } from 'svelte/transition';

	interface Props {
		tarea: TareaApp;
		handleComplete: (id: number) => void;
		handleDelete: (id: number) => void;
		handleEdit: (id: number) => void;
	}

	let { tarea, handleComplete, handleDelete, handleEdit }: Props = $props();

	let completadaInternal = $derived(tarea.completada);

	const isAdmin = getUserIsAdmin();

	const recurrenceColors: Record<RecurrenceType, string> = {
		[RecurrenceType.DIARIA]: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
		[RecurrenceType.SEMANAL]: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
		[RecurrenceType.QUINCENAL]: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
		[RecurrenceType.MENSUAL]: 'bg-purple-50 text-purple-600 border border-purple-200',
		[RecurrenceType.UNA_VEZ]: 'bg-gray-50 text-gray-600 border border-gray-200'
	};

	const taskIsDelayed = $derived.by(() => isBeforeToday(tarea.fecha) && !tarea.completada);

	const handleCompletadaChange = (id: number) => {
		completadaInternal = !completadaInternal;
		handleComplete(id);
	};
</script>

<div
	transition:fade={{ duration: 150 }}
	class="rounded-lg border border-gray-100 bg-gray-100/60 p-4 transition-shadow hover:shadow-sm"
	class:line-through={completadaInternal}
	class:opacity-60={completadaInternal}
>
	<div class="flex items-center gap-3">
		<div class="flex flex-grow gap-2">
			<div class="flex-grow space-y-1">
				<p>{tarea.descripcion}</p>
				<div class="space-y-2">
					<div class="flex items-center gap-1 text-xs text-gray-500">
						<span>{tarea.puesto.label}</span>
						<span>|</span>
						<span
							class={`rounded-full px-1.5 py-0.5 text-xs font-medium ${recurrenceColors[tarea.recurrencia.recurrenceType]}`}
						>
							{tarea.recurrencia.label ?? tarea.recurrencia.recurrenceType}
						</span>
					</div>

					<p
						class="flex items-center gap-1 text-xs text-gray-500"
						class:text-red-600={taskIsDelayed}
						class:font-medium={taskIsDelayed}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
						{isAdmin ? `${getDayName(tarea.fecha)} ${tarea.fecha}` : tarea.fecha}
					</p>
				</div>
			</div>
			<div class="flex flex-shrink-0 flex-col py-1">
				<button
					onclick={() => handleCompletadaChange(tarea.id)}
					class="inline-flex cursor-pointer items-center"
					aria-label="completar tarea"
				>
					<input type="checkbox" class="peer sr-only" readonly checked={completadaInternal} />
					<div
						class="peer relative h-7 w-14 rounded-full bg-gray-200 peer-checked:bg-orange-500 peer-focus:ring-4 peer-focus:ring-orange-300 peer-focus:outline-none after:absolute after:start-[4px] after:top-0.5 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"
					></div>
				</button>
			</div>
		</div>
	</div>
	{#if isAdmin}
		<div class="flex justify-end space-x-2">
			<button
				onclick={() => handleDelete(tarea.id)}
				aria-label="eliminar tarea"
				class="inline-flex items-center rounded-lg border border-red-700 px-3 py-2.5 text-center text-sm font-semibold text-red-700 hover:bg-red-800 hover:text-white focus:ring-4 focus:ring-red-400 focus:outline-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="me-1.5 size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
					/>
				</svg>
				Eliminar
			</button>
			<button
				onclick={() => handleEdit(tarea.id)}
				aria-label="editar tarea"
				class="inline-flex items-center rounded-lg border border-amber-500 px-3 py-2.5 text-center text-sm font-semibold text-amber-600 hover:bg-amber-600 hover:text-white focus:ring-4 focus:ring-amber-500 focus:outline-none"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="me-1.5 size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
					/>
				</svg>
				Editar</button
			>
		</div>
	{/if}
</div>
