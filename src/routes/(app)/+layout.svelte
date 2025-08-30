<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { children } = $props();
</script>

<Header />
<main class="px-4 py-6">
	{@render children()}
</main>
