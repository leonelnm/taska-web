<script lang="ts">
	import type { UserResponse } from '$lib/types';

	let { user }: { user: UserResponse } = $props();
</script>

<div>
	<p>{user.username}</p>
	<p>{user.nombre}</p>
	<p>{user.puesto}</p>
</div>
