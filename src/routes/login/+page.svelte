<script lang="ts">
	let { form } = $props();
</script>

<div class="flex h-svh flex-col justify-center p-8">
	<form
		method="POST"
		class="mx-auto mb-40 w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm"
	>
		<img class="mx-auto h-30 w-30" src="/taska.webp" alt="Taska Logo" />
		<h1 class="text-center text-xl font-bold">Iniciar sesión</h1>
		<div class="mb-5">
			<label for="username" class="mb-2 block text-sm font-medium text-gray-900">Usuario</label>
			<input
				type="text"
				id="username"
				name="username"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				placeholder="usuario"
				required
				value="admin"
				autocomplete="off"
			/>
		</div>
		<div class="mb-5">
			<label for="password" class="mb-2 block text-sm font-medium text-gray-900">Contraseña</label>
			<input
				type="password"
				name="password"
				id="password"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				required
				value="password"
				placeholder="••••••••"
			/>
		</div>

		{#if form?.error}
			<div class="text-center text-sm text-red-600">
				{form.error}
			</div>
		{/if}

		<button
			type="submit"
			class="mt-5 w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto"
			>Acceder</button
		>
	</form>
</div>
