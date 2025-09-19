<script lang="ts">
	import { goto } from '$app/navigation';
	import { formatDayName, getDate, now, obtenerSemana } from '$lib/api/dateUtils';
	import type { FiltroTareaRequest } from '$lib/types';
	import type { Dayjs } from 'dayjs';
	import { fade } from 'svelte/transition';

	interface Props {
		filtroState?: FiltroTareaRequest;
	}

	let { filtroState }: Props = $props();

	const today = now();

	let currentDate = $state(getDate(filtroState?.fecha));
	let diasSemana = $derived(obtenerSemana(currentDate));
	let selected = $state(getDate(filtroState?.fecha));

	let isToday = $derived.by(() => today.isSame(selected, 'day'));

	const handleNextWeek = () => {
		const nextWeekDate = currentDate.add(7, 'day');
		currentDate = nextWeekDate;
	};

	const searchByDate = (date: Dayjs) => {
		currentDate = date;
		selected = date;
		goto(`/searcher?fecha=${date.format('YYYY-MM-DD')}`);
	};

	const goToday = () => {
		searchByDate(today);
	};
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white py-4 shadow-sm sm:p-6 md:p-8">
	<div class="flex items-center justify-between">
		<h1 class="px-4 py-2">{currentDate.format('MMMM YYYY')}</h1>
		{#if !isToday}
			<div class="px-4" transition:fade={{ duration: 150 }}>
				<button
					class="flex items-center gap-1 rounded-2xl bg-amber-600 px-3 py-2 text-xs text-white"
					onclick={goToday}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
						/>
					</svg>

					Hoy</button
				>
			</div>
		{/if}
	</div>
	<div class="mt-2 flex items-center justify-between">
		<button aria-label="Previous week" class="rounded p-2" onclick={handleNextWeek}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
			</svg>
		</button>
		<div class="flex overflow-hidden">
			{#each diasSemana as dia}
				<button
					type="button"
					onclick={() => searchByDate(dia)}
					class="flex flex-col items-center justify-center gap-1 rounded-full p-2
        {selected.isSame(dia, 'date') ? 'rounded-full border border-orange-300 bg-orange-50' : ''}"
				>
					<span class="text-xs">{formatDayName(dia)}</span>
					<span
						class="inline-flex h-4 w-4 items-center justify-center rounded-full p-3 text-xs font-medium
           {selected.isSame(dia, 'date') ? ' bg-amber-700 font-semibold text-orange-50' : ''}"
						>{dia.format('DD')}</span
					>
				</button>
			{/each}
		</div>
		<button class="rounded p-2" aria-label="Next week" onclick={handleNextWeek}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
			</svg>
		</button>
	</div>
</div>
