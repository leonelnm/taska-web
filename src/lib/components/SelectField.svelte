<script lang="ts">
	type Option = Record<string, any>;

	export let label: string;
	export let name: string;
	export let value: any;
	export let options: Option[] = [];
	export let placeholder: string = 'Todos';
	export let valueKey: string;
	export let labelKey: string = 'label';
	export let includeAll: boolean = true;
</script>

<div class="basis-xs space-y-0.5">
	<label for={name} class="block text-xs font-medium text-gray-700">{label}</label>
	<select
		{name}
		class="w-full rounded-md border border-gray-300 px-3 py-2 transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
		bind:value
	>
		{#if includeAll}
			<option value={undefined}>{placeholder}</option>
		{/if}

		{#each options as option}
			<option value={option[valueKey]}>
				{option[labelKey]}
			</option>
		{/each}
	</select>
</div>
