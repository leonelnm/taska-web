<script lang="ts">
	import CrearUsuario from '$lib/components/usuarios/CrearUsuario.svelte';
	import Usuario from '$lib/components/usuarios/Usuario.svelte';
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();

	let puestos = $derived(data.puestos);
	let users = $derived(data.users);
</script>

<main class="space-y-6">
	<CrearUsuario {puestos} formErrors={form?.errors} data={form?.data} />

	<section
		class="w-full space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8"
	>
		<h2 class="text-xl font-medium">Usuarios</h2>
		<div class="space-y-4">
			{#each users as u (u.id)}
				<Usuario user={u} />
			{/each}
		</div>
	</section>
</main>
