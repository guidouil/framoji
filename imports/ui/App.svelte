<script>
  export let emoji = "🖼️";
  export let message = "The message";
  export let width = 10;
  $: marge =
    width - 2 / 2 >= message.length * 0.33
      ? Math.round((width - 2 - message.length * 0.33) / 2)
      : 1;
</script>

<div class="main">
  <div class="hero min-h-screen bg-base-200">
    <div class="text-center hero-content">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Framoji! {emoji}</h1>
        <p>Put some text inside an emoji frame</p>
        <hr />
        <label for="emoji">Emoji</label>
        <input
          type="text"
          bind:value={emoji}
          placeholder="Frame emoji"
          id="emoji"
          class="input input-bordered input-lg w-full max-w-xs"
        />
        <br />
        <label for="message">Message</label>
        <input
          type="text"
          bind:value={message}
          placeholder="Message inside frame"
          class="input input-bordered input-lg w-full max-w-xs"
        />
        <hr />

        {#if emoji && width}
          <pre>
{#each Array(width) as _, i}
              {emoji}
            {/each}
{emoji}{#each Array(width - 2) as _}◻️{/each}{emoji}
{emoji}{#each Array(marge) as _}◻️{/each}{message}{#each Array(marge) as _}◻️{/each}{emoji}
{emoji}{#each Array(width - 2) as _}◻️{/each}{emoji}
{#each Array(width) as _}
              {emoji}
            {/each}
        </pre>
        {/if}
      </div>
    </div>
  </div>
</div>
