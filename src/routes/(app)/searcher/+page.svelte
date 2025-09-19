<script lang="ts">
	import FiltroFecha from '$lib/components/FiltroFecha.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="space-y-6">
	<FiltroFecha filtroState={data.filtro} />
	<Tareas tareas={data.tareas} />
</div>
