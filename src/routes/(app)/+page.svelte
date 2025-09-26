<script lang="ts">
	import Filtro from '$lib/components/Filtro.svelte';
	import FiltroFecha from '$lib/components/FiltroFecha.svelte';
	import Tareas from '$lib/components/Tareas.svelte';
	import type { PageProps } from './$types';
	import { getUserIsEncargado } from '$lib/context';

	const { data }: PageProps = $props();

	let isEncargado = getUserIsEncargado();

	let loading = $state(false);
</script>

<div class="space-y-6">
	{#if data.isAdmin || isEncargado}
		<Filtro
			turnos={data.turnos}
			puestos={data.puestos}
			filtroState={data.filtro}
			isAdmin={data.isAdmin}
			bind:loading
		/>
	{/if}

	{#if !data.isAdmin && !isEncargado}
		<FiltroFecha filtroState={data.filtro} bind:loading turnos={data.turnos} />
	{/if}

	<Tareas tareas={data.tareas} {loading} />
</div>
