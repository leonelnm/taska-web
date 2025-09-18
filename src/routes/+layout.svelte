<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="favicon.svg" sizes="any" type="image/svg+xml" />
</svelte:head>

<div class="flex min-h-screen flex-col bg-gray-50 text-gray-900">
	{@render children()}
</div>
