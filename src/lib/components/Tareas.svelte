<script lang="ts">
	import { RecurrenceType, type TareaApp } from '$lib/types';
	import { flip } from 'svelte/animate';
	import Tarea from './Tarea.svelte';
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { cubicInOut } from 'svelte/easing';

	interface Props {
		tareas: TareaApp[];
		loading: boolean;
	}

	let { tareas, loading = false }: Props = $props();

	let incompletas = $derived.by(() => tareas.filter((t) => !t.completada));
	let completadas = $derived.by(() => tareas.filter((t) => t.completada));

	let count = $derived.by(() => {
		return {
			total: tareas.length,
			completadas: completadas.length,
			incompletas: incompletas.length
		};
	});

	// Modal state
	let showModal = $state(false);
	let tareaToDelete = $state<TareaApp | null>(null);

	const handleComplete = async (id: number) => {
		try {
			const response = await fetch(`/api/tarea/${id}/complete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				// Recargar los datos desde el servidor
				await invalidateAll();
			} else {
				console.error('Error completando tarea');
			}
		} catch (error) {
			console.error('Error en la petición:', error);
		}
	};

	const handleEdit = (id: number) => {
		// Lógica para editar la tarea
	};

	const handleDelete = (id: number) => {
		const tarea = tareas.find((t) => t.id === id);
		if (!tarea) return;

		if (tarea.recurrencia.recurrenceType !== RecurrenceType.UNA_VEZ) {
			tareaToDelete = tarea;
			showModal = true;
			// Deshabilitar scroll del body
			document.body.style.overflow = 'hidden';
		} else {
			// Eliminar tarea única directamente
			deleteTarea(id, false);
		}
	};

	const deleteTarea = async (id: number, deleteAll: boolean) => {
		try {
			const response = await fetch(`/api/tarea/${id}/delete`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ deleteAll })
			});

			if (response.ok) {
				await invalidateAll();
			} else {
				console.error('Error eliminando tarea');
			}
		} catch (error) {
			console.error('Error en la petición:', error);
		} finally {
			closeModal();
		}
	};

	const handleDeleteAll = () => {
		if (tareaToDelete) {
			deleteTarea(tareaToDelete.id, true);
		}
	};

	const handleDeleteSingle = () => {
		if (tareaToDelete) {
			deleteTarea(tareaToDelete.id, false);
		}
	};

	const closeModal = () => {
		showModal = false;
		tareaToDelete = null;
		// Restaurar scroll del body
		document.body.style.overflow = '';
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<h2 class="text-xl font-medium">Tareas</h2>
			<span class="text-gray-600">{count.completadas}/{count.total}</span>
		</div>

		{#key count.incompletas}
			{#if count.incompletas > 0}
				<p class="text-gray-600" transition:fade={{ duration: 200 }}>
					Pendientes: {count.incompletas}
				</p>
			{:else if count.total > 0}
				<div
					class="flex items-center gap-2 text-amber-600"
					transition:fade={{ duration: 200, delay: 100 }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
						/>
					</svg>

					<span class="font-medium">¡Todas completadas!</span>
				</div>
			{/if}
		{/key}
	</div>

	{#if loading || tareas.length === 0}
		<p class="mt-4 text-gray-500">
			{loading ? 'Cargando...' : 'No hay tareas disponibles.'}
		</p>
	{/if}

	{#if !loading && tareas.length > 0}
		<div class="space-y-4">
			<div class="mt-4 space-y-4">
				{#each incompletas as tarea (tarea.id)}
					<div animate:flip>
						<Tarea {tarea} {handleComplete} {handleEdit} {handleDelete} />
					</div>
				{/each}
			</div>
			<div class="mt-4 space-y-4">
				{#each completadas as tarea (tarea.id)}
					<Tarea {tarea} {handleComplete} {handleEdit} {handleDelete} />
				{/each}
			</div>
		</div>
	{/if}
</div>

<!-- Modal de confirmación -->
{#if showModal}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/90"
		transition:fade={{ duration: 100, easing: cubicInOut }}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
		onclick={closeModal}
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div class="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
			<!-- Botón cerrar (solo visible en pantallas grandes) -->
			<button
				type="button"
				class="absolute top-4 right-4 hidden rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:block"
				aria-label="Cerrar modal"
				onclick={closeModal}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Botón cerrar mobile (solo visible en mobile) -->
			<button
				type="button"
				class="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none sm:hidden"
				aria-label="Cerrar modal"
				onclick={closeModal}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
				</svg>
			</button>

			<div class="mb-4 pr-8">
				<h3 class="text-lg font-semibold text-gray-900">Eliminar tarea recurrente</h3>
			</div>

			<div class="mb-6">
				<p class="text-gray-600">
					Esta tarea es recurrente. ¿Deseas eliminar solo esta instancia o todas las futuras?
				</p>
			</div>

			<!-- Botones mobile: Borrar todas (izq) - Solo esta (der) -->
			<div class="flex gap-3 sm:hidden">
				<button
					type="button"
					class="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
					onclick={handleDeleteAll}
				>
					Eliminar todas
				</button>
				<button
					type="button"
					class="flex-1 rounded-md border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
					onclick={handleDeleteSingle}
				>
					Solo esta
				</button>
			</div>

			<!-- Botones desktop: Cancelar - Eliminar todas - Solo esta -->
			<div class="hidden justify-end gap-3 sm:flex">
				<button
					type="button"
					class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
					onclick={closeModal}
				>
					Cancelar
				</button>
				<button
					type="button"
					class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
					onclick={handleDeleteAll}
				>
					Eliminar todas
				</button>
				<button
					type="button"
					class="rounded-md border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-none"
					onclick={handleDeleteSingle}
				>
					Solo esta
				</button>
			</div>
		</div>
	</div>
{/if}
