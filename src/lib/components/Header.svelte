<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';

	let { isAdmin = false } = $props();

	const handleLogout = async () => {
		await fetch('/api/logout', { method: 'POST' });
		await invalidateAll();
		goto('/login');
	};

	let routes = $derived.by(() => {
		let data = [
			{ path: '/', label: 'Inicio' },
			{ path: '/perfil', label: 'Mi Perfil' }
		];

		if (isAdmin) {
			data = [
				...data,
				{ path: '/admin/tarea', label: 'Crear Tarea' },
				{ path: '/admin/usuarios', label: 'Usuarios' }
			];
		}

		return data;
	});

	let open = $state(false);
</script>

<header class="w-full bg-white shadow-sm">
	<nav class="container mx-auto flex flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-1 px-3 py-2 text-amber-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>

			<span class="self-center text-xl font-semibold whitespace-nowrap">Taska</span>
		</a>
		<div class="flex items-center space-x-3 md:hidden">
			{#if isAdmin}
				<a
					href="/admin/tarea"
					class="rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 focus:outline-none"
					>Agregar tarea</a
				>
			{/if}

			<button
				type="button"
				class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none"
				aria-controls="navbar"
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				<span class="sr-only">Open main menu</span>
				<svg class="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
					<path
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M1 1h15M1 7h15M1 13h15"
					/>
				</svg>
			</button>
		</div>

		<!-- MENÚ NAVEGACIÓN -->
		{#if open}
			<div
				class="w-full items-center justify-between md:order-1 md:hidden"
				id="navbar-sticky"
				transition:slide={{ duration: 100 }}
			>
				<ul
					class="mt-4 flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium"
				>
					{#each routes as option}
						<li>
							<a
								onclick={() => (open = !open)}
								href={option.path}
								class="block rounded-sm px-3 py-2 text-right text-gray-900 hover:bg-amber-700 hover:text-white {page
									.url.pathname === option.path
									? 'bg-amber-700 text-white'
									: ''}"
							>
								{option.label}
							</a>
						</li>
					{/each}
					<li>
						<button
							class="flex w-full justify-end rounded-sm px-3 py-2 hover:bg-amber-700 hover:text-white"
							onclick={handleLogout}
						>
							Cerrar sesión
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
								/>
							</svg>
						</button>
					</li>
				</ul>
			</div>
		{/if}

		{#if !open}
			<div
				class="hidden w-auto items-center justify-between md:order-1 md:flex"
				transition:slide={{ duration: 100 }}
			>
				<ul class="flex flex-row gap-3 rounded-lg p-4 font-medium">
					{#each routes as option}
						<li>
							<a
								href={option.path}
								class="block rounded-sm px-3 py-2 hover:bg-amber-600 hover:text-white
									{page.url.pathname === option.path ? 'bg-amber-600 text-white' : 'text-gray-900'}"
							>
								{option.label}
							</a>
						</li>
					{/each}
					<li>
						<button
							class="flex rounded-sm px-3 py-2 text-left hover:bg-amber-600 hover:text-white"
							onclick={handleLogout}
						>
							Cerrar sesión

							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
								/>
							</svg>
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</nav>
</header>
