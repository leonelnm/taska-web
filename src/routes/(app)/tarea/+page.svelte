<script lang="ts">
	import NuevaTarea from '$lib/components/NuevaTarea.svelte';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
	const { puestos, turnos } = data;
</script>

<div class="space-y-6">
	<NuevaTarea {turnos} {puestos} />
</div>
