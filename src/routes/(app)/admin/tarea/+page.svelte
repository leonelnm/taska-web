<script lang="ts">
	import NuevaTarea from '$lib/components/NuevaTarea.svelte';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();
	const { puestos, turnos } = data;
</script>

<NuevaTarea {turnos} {puestos} error={form?.message} />
