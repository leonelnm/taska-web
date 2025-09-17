<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	interface Props {
		collapsed: boolean;
		title: string;
		children: Snippet;
	}

	let { collapsed = $bindable(false), title, children }: Props = $props();

	const animationOptions = { duration: 100, y: -10 };

	let isCollapsed = $derived(collapsed);

	const handleClose = () => {
		isCollapsed = !isCollapsed;
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
	<div class="flex items-center justify-between">
		<h5 class="text-xl font-medium text-gray-900">{title}</h5>
		<button
			type="button"
			class="ml-auto rounded-lg p-1.5 text-gray-400 transition-transform duration-75 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 focus:outline-none"
			class:rotate-180={!isCollapsed}
			aria-label={isCollapsed ? 'Expandir' : 'Colapsar'}
			tabindex="-1"
			onclick={handleClose}
		>
			<svg fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		</button>
	</div>
	{#if !isCollapsed}
		<div transition:fly={animationOptions}>
			{@render children?.()}
		</div>
	{/if}
</div>
