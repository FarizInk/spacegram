<script>
	import { onMount } from 'svelte';
	import '../app.css';

	onMount(() => {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		}
	});
</script>

<div class="container mx-auto max-w-4xl min-h-screen flex flex-col items-center justify-center">
	<slot />
</div>
