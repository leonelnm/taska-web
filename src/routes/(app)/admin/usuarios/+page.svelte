<script lang="ts">
	import CardCollapse from '$lib/components/CardCollapse.svelte';
	import CrearUsuario from '$lib/components/usuarios/CrearUsuario.svelte';
	import Usuario from '$lib/components/usuarios/Usuario.svelte';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	console.log(form);

	let puestos = $derived(data.puestos);
	let users = $derived(data.users);
</script>

<main class="space-y-6">
	<CrearUsuario {puestos} />

	<section
		class="w-full space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
	>
		<h2 class="text-xl font-medium">Usuarios</h2>
		<div class="divide-y divide-gray-200">
			{#each users as u}
				<Usuario user={u} />
			{/each}
		</div>
	</section>
</main>
