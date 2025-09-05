<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { slide } from 'svelte/transition';
	import { page } from '$app/state';

	const handleLogout = async () => {
		await fetch('/api/logout', { method: 'POST' });
		await invalidateAll();
		goto('/login');
	};

	const pagesCommon = [
		{ path: '/', label: 'Inicio' },
		{ path: '/admin/tarea', label: 'Crear Tarea' },
		{ path: '/admin/usuarios', label: 'Usuarios' },
		{ path: '/perfil', label: 'Perfil' }
	];

	let open = $state(false);
</script>

<header class="w-full bg-white shadow-sm">
	<nav class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
		<a href="/" class="flex items-center space-x-3">
			<img src="/taska.webp" alt="Taska Logo" class="h-10" />
			<span class="self-center text-xl font-semibold whitespace-nowrap text-orange-400">Taska</span>
		</a>
		<div class="flex items-center space-x-3 md:hidden">
			<a
				href="/tarea"
				class="rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:ring-4 focus:ring-pink-200 focus:outline-none"
				>Agregar tarea</a
			>

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
				<ul class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium">
					{#each pagesCommon as option}
						<li>
							<a
								onclick={() => (open = !open)}
								href={option.path}
								class="block rounded-sm px-3 py-2 text-gray-900 hover:bg-blue-700 hover:text-white {page
									.url.pathname === option.path
									? 'bg-blue-700 text-white'
									: ''}"
							>
								{option.label}
							</a>
						</li>
					{/each}
					<li>
						<button
							class="block w-full rounded-sm px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
							onclick={handleLogout}
						>
							Cerrar sesión
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
					{#each pagesCommon as option}
						<li>
							<a
								href={option.path}
								class="block rounded-sm px-3 py-2 hover:bg-blue-700 hover:text-white
									{page.url.pathname === option.path ? 'bg-blue-700 text-white' : 'text-gray-900'}"
							>
								{option.label}
							</a>
						</li>
					{/each}
					<li>
						<button
							class="block rounded-sm px-3 py-2 text-left hover:bg-blue-700 hover:text-white"
							onclick={handleLogout}
						>
							Cerrar sesión
						</button>
					</li>
				</ul>
			</div>
		{/if}
	</nav>
</header>
