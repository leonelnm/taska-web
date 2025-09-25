<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import { setUserIsAdmin } from '$lib/context.js';

	let { data, children } = $props();

	setUserIsAdmin(data.isAdmin);
</script>

<Header isAdmin={data.isAdmin} name={data?.user?.name} />
<main class="container mx-auto px-4 py-6">
	{@render children()}
</main>
