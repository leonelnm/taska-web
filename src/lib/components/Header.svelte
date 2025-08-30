<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';

	const handleLogout = async () => {
		console.log('1. handleLogout');
		await fetch('/api/logout', { method: 'POST' });

		await invalidateAll();
		console.log('2. invalidar');

		goto('/login');
	};
</script>

<header class="bg-white px-4 py-4 shadow-sm">
	<div class="container mx-auto flex items-center justify-between">
		<a class="flex items-center gap-2" href="/">
			<img src="/taska.webp" alt="Taska Logo" class="h-12 w-12 rounded-full" />
			<h5 class="text-xl font-medium">Taska</h5>
		</a>
		<div class="flex items-center justify-between">
			<div>
				<button
					class="flex space-x-1 rounded-full p-2 transition-colors hover:bg-gray-100"
					aria-label="Perfil"
				>
					<span>Change ME</span>
					<svg viewBox="0 0 24 24" fill="currentColor" class="size-6">
						<path
							fill-rule="evenodd"
							d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</button>
				<button class="bg-amber-300 p-2 hover:bg-amber-400" onclick={handleLogout}
					>Cerrar session</button
				>
			</div>
		</div>
	</div>
</header>
