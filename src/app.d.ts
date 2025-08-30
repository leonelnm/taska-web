// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ProfileResponse } from "$lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: ProfileResponse | null
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
