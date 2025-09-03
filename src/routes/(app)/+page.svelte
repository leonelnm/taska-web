<script lang="ts">
	import Filtro from '$lib/components/Filtro.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { tareas, turnos, puestos, filtro, isAdmin } = data;
</script>

<div class="space-y-6">
	<div>
		<a
			href="/tarea"
			class="rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-blue-300 focus:outline-none"
			>Agregar tarea</a
		>
	</div>

	<Filtro {turnos} {puestos} filtroState={filtro} {isAdmin} />

	<Tareas {tareas} />
</div>
