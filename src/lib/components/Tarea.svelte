<script lang="ts">
	import { enhance } from '$app/forms';
	import type { TareaApp } from '$lib/types';

	let { tarea }: { tarea: TareaApp } = $props();
</script>

<div class="rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-sm">
	<div class="flex items-center gap-3">
		<div class="min-w-0 flex-1">
			<h3 class="mb-1 text-sm font-medium">{tarea.descripcion}</h3>
			<div class="flex items-center space-x-2 text-xs text-gray-500">
				<span class="rounded bg-gray-100 px-2 py-0.5">{tarea.recurrencia.label}</span>
				<span>{tarea.puesto.label}</span> <span>{tarea.diaSemana}</span>
			</div>
		</div>

		<form
			method="POST"
			action="?/complete"
			use:enhance={() => {
				return async ({ result, update }) => {
					const inititialState = tarea.completada;
					if (result.type === 'success') {
						tarea.completada = !tarea.completada;
					} else {
						tarea.completada = inititialState;
					}
					await update();
				};
			}}
		>
			<input type="hidden" name="id" value={tarea.id} />
			<button
				type="submit"
				class="inline-flex cursor-pointer items-center"
				aria-label="completar tarea"
			>
				<input type="checkbox" class="peer sr-only" checked={tarea.completada} readonly />
				<div
					class="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-orange-500 peer-focus:ring-4 peer-focus:ring-orange-300 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
				></div>
			</button>
		</form>
	</div>
</div>
