<script lang="ts">
	import type { TareaApp } from '$lib/types';

	let { tarea }: { tarea: TareaApp } = $props();

	const handleComplete = async (event: Event) => {
		const input = event.target as HTMLInputElement;
		tarea.completada = input.checked;

		// try {
		// 	await completarTarea(tarea.id);
		// } catch (error) {
		// 	console.error('Error completando tarea:', error);
		// 	tarea.completada = !input.checked;
		// }
	};
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
		<label class="inline-flex cursor-pointer items-center">
			<input
				type="checkbox"
				class="peer sr-only"
				checked={tarea.completada}
				onchange={handleComplete}
			/>
			<div
				class="peer relative h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-green-600 peer-focus:ring-4 peer-focus:ring-green-300 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full"
			></div>
		</label>
	</div>
</div>
