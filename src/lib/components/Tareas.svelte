<script lang="ts">
	import type { TareaApp } from '$lib/types';
	import { flip } from 'svelte/animate';
	import Tarea from './Tarea.svelte';
	import { fade } from 'svelte/transition';

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

	const handleComplete = async (id: number) => {
		const tarea = tareas.find((t) => t.id === id);
		if (!tarea) return;

		const response = await fetch(`/api/tarea/${id}/complete`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			tarea.completada = !tarea.completada;
		}

		tareas = tareas.map((t) => (t.id === id ? { ...t, completada: !t.completada } : t));
	};

	const handleEdit = (id: number) => {
		// Lógica para editar la tarea
	};

	const handleDelete = (id: number) => {
		// Lógica para eliminar la tarea
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<h2 class="text-xl font-medium">Tareas</h2>
			<span class="text-gray-600">{count.completadas}/{count.total}</span>
		</div>

		{#if count.incompletas > 0}
			<p class="text-gray-600" transition:fade>Pendientes: {count.incompletas}</p>
		{/if}
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
