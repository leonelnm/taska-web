<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/taska.webp';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
	{@render children()}
</div>
