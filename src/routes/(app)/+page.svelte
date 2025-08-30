<script lang="ts">
	import Filtro from '$lib/components/Filtro.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { tareas, turnos, puestos, filtro } = data;
</script>

<div class="space-y-6">
	<Filtro {turnos} {puestos} filtroState={filtro} />

	<Tareas {tareas} />
</div>
