<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { getUserIsEncargado, setUserIsAdmin, setUserIsEncargado } from '$lib/context.js';
	import { PuestoType } from '$lib/types.js';

	let { data, children } = $props();

	setUserIsAdmin(data.isAdmin);
	setUserIsEncargado(data?.user?.puesto?.includes(PuestoType.ENCARGADO));

	let isEncargado = getUserIsEncargado();
</script>

<Header isAdmin={data.isAdmin} name={data?.user?.name} {isEncargado} />
<main class="container mx-auto px-4 py-6">
	{@render children()}
</main>
