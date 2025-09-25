<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-dvh flex-col justify-center p-8">
	<div class="mx-auto w-full max-w-md text-center">
		<!-- Logo de Taska -->
		<div class="mb-8 flex flex-col items-center justify-center gap-2 text-amber-600">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-14"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>

			<h1 class="self-center text-3xl font-semibold whitespace-nowrap">Taska</h1>
		</div>

		<!-- Contenido del error -->
		<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
			<div class="space-y-2">
				<h1 class="text-6xl font-bold text-amber-600">404</h1>
				<h2 class="text-xl font-semibold text-gray-900">Página no encontrada</h2>
			</div>

			<p class="text-gray-600">
				Lo sentimos, la página que estás buscando no existe o ha sido movida.
			</p>

			<!-- Botón para ir al inicio -->
			<a
				type="button"
				href="/"
				class="w-full rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
			>
				Ir al inicio
			</a>

			<!-- Información adicional -->
			<div class="pt-4 text-xs text-gray-500">
				{#if page.url}
					Ruta solicitada: <code class="rounded bg-gray-100 px-1 py-0.5">{page.url.pathname}</code>
				{/if}
			</div>
		</div>
	</div>
</div>
