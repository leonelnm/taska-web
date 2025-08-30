<script lang="ts">
	import Filtro from '$lib/components/Filtro.svelte';
	import NuevaTarea from '$lib/components/NuevaTarea.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { tareas, puestos, turnos, filtro } = data;
</script>

<div class="space-y-6">
	<NuevaTarea {turnos} {puestos} />

	<Filtro {turnos} {puestos} filtroState={filtro} isAdmin />

	<Tareas {tareas} />
</div>
