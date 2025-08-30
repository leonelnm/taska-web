<script lang="ts">
	import type { TareaApp } from '$lib/types';
	import Tarea from './Tarea.svelte';

	export let tareas: TareaApp[] = [];
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<h5 class="text-xl font-medium text-gray-900">Tareas</h5>
	{#if tareas.length === 0}
		<p class="mt-4 text-gray-500">No hay tareas disponibles.</p>
	{:else}
		<div class="mt-4 space-y-4">
			{#each tareas as tarea}
				<Tarea {tarea} />
			{/each}
		</div>
	{/if}
</div>
