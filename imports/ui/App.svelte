<script>
  export let emoji = '🖼️';
	export let message = 'The message';
	export let width = 12;
	$: marge = (width)/2 >= (message.length*0.5) ? Math.round(((width) - message.length*0.5)/2) : 1;
</script>


<div class="main">
	<h1>Framoji! {marge}</h1>
	<label for="emoji">Emoji</label>
	<input type="text" bind:value={emoji} placeholder="Frame emoji" id="emoji" />
	<br/>
	<label for="message">Message</label>
	<input type="text" bind:value={message} placeholder="Message inside frame" i />

	<hr />

	{#if emoji && width}
	<pre>
{#each Array(width) as _, i}
{emoji}
{/each}
{emoji}{#each Array(width-2) as _}◻️{/each}{emoji}
{emoji}{#each Array(marge) as _}◻️{/each}{message}{#each Array(marge) as _}◻️{/each}{emoji}
{emoji}{#each Array(width-2) as _}◻️{/each}{emoji}
{#each Array(width) as _}
{emoji}
{/each}
	</pre>
	{/if}
</div>

<style>
	.main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		.main {
			max-width: none;
		}
	}
</style>
