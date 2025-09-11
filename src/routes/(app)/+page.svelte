<script lang="ts">
	import Filtro from '$lib/components/Filtro.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="container mx-auto space-y-6">
	<Filtro
		turnos={data.turnos}
		puestos={data.puestos}
		filtroState={data.filtro}
		isAdmin={data.isAdmin}
	/>

	<Tareas tareas={data.tareas} />
</div>
