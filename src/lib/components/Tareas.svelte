<script lang="ts">
	import type { TareaApp } from '$lib/types';
	import { flip } from 'svelte/animate';
	import Tarea from './Tarea.svelte';
	import { cubicOut } from 'svelte/easing';

	let { tareas }: { tareas: TareaApp[] } = $props();

	let sortedTareas = $derived.by(() =>
		[...tareas].sort((a, b) => {
			if (a.completada === b.completada) return 0;
			return a.completada ? 1 : -1;
		})
	);

	let count = $derived.by(() => {
		return {
			total: tareas.length,
			completadas: tareas.filter((t) => t.completada).length
		};
	});
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<h5 class="text-xl font-medium text-gray-900">Tareas {count.completadas}/{count.total}</h5>
	{#if sortedTareas.length === 0}
		<p class="mt-4 text-gray-500">No hay tareas disponibles.</p>
	{:else}
		<div class="mt-4 space-y-4">
			{#each sortedTareas as tarea (tarea.id)}
				<div
					animate:flip={{
						duration: 500,
						easing: cubicOut
					}}
				>
					<Tarea {tarea} />
				</div>
			{/each}
		</div>
	{/if}
</div>
