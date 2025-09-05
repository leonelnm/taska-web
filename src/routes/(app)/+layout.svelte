<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { data, children } = $props();
</script>

<Header isAdmin={data.isAdmin} />
<main class="px-4 py-6">
	{@render children()}
</main>
