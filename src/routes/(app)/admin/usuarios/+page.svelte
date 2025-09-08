<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();

	let puestosL = $derived(data.puestos);
	let users = $derived(data.users);
</script>

<main class="space-y-6">
	<section
		class="w-full space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
	>
		{#each puestosL as puesto}
			<div>{puesto.id} - {puesto.label} - {puesto.puesto}</div>
		{/each}
	</section>

	<section
		class="w-full space-y-2 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
	>
		{#each users as u}
			<p>{u.username} · {u.nombre}</p>
		{/each}
	</section>
</main>
