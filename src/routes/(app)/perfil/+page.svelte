<script lang="ts">
	import ChangePassword from '$lib/components/ChangePassword.svelte';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let user = $derived(data.user);
</script>

<div class="space-y-6">
	<div class="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
		<div class="flex items-center gap-6">
			<h1 class="text-xl font-medium">Perfil de Usuario</h1>
			{#if user?.isAdmin}
				<span class="rounded-full bg-orange-50 px-3 py-1 text-xs">Administrador</span>
			{/if}
		</div>

		<div class="mt-8 space-y-8">
			<section>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<p class="text-sm text-gray-500">Nombre de usuario</p>
						<p class="font-medium">{user?.username}</p>
					</div>
					<div class="space-y-2">
						<p class="text-sm text-gray-500">Nombre completo</p>
						<p class="font-medium">{user?.name}</p>
					</div>
					<div class="space-y-2">
						<p class="text-sm text-gray-500">Puesto</p>
						<p class="font-medium">{user?.puesto}</p>
					</div>
				</div>
			</section>
		</div>
	</div>

	<ChangePassword formErrors={form?.errors} />
</div>
