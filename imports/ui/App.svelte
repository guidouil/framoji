<script>
  const copy = require("clipboard-copy");

  let emoji = "🌼";
  let bg = "⬜";
  let line = "The message";
  let width = 10;

  $: result = () => {
    let border = "";
    for (let i = 0; i < width; i += 1) {
      border += emoji;
    }
    let margin = "\n";
    for (let i = 0; i < width; i += 1) {
      if (i === 0 || i === width - 1) {
        margin += emoji;
      } else {
        margin += bg;
      }
    }
    let framedLines = "";
    const margeCount = Math.floor((width - 2 - line.length / 2.5) / 2);
    let marge = "";
    if (margeCount > 0) {
      for (let i = 0; i < margeCount; i += 1) {
        marge += bg;
      }
    }
    framedLines += `\n${emoji}${marge}${line}${marge}${emoji}`;
    // if (lines && lines.length > 0) {
    //   lines.forEach((line) => {
    //   });
    // }
    return `${border}${margin}${framedLines}${margin}\n${border}`;
  };
</script>

<div class="main">
  <div class="hero min-h-screen bg-base-200">
    <div class="text-center hero-content">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Framoji! {emoji}</h1>
        <p>Put some lines inside an emoji frame</p>
        <div class="divider" />
        <label class="label" for="emoji">Emoji</label>
        <input
          type="text"
          bind:value={emoji}
          placeholder="Frame emoji"
          id="emoji"
          class="input input-bordered input-lg w-full max-w-xs"
        />
        <label class="label" for="message">Message</label>
        <!-- {#each lines as line, i} -->
        <input
          type="text"
          bind:value={line}
          placeholder="Message inside frame"
          class="input input-bordered input-lg w-full max-w-xs"
        />
        <!-- {/each} -->

        <label class="label" for="result">Result</label>
        <textarea
          class="textarea textarea-primary"
          name="result"
          id="result"
          rows="6"
          cols={width * 2.4}
          value={result()}
        />
        <br />
        <button class="btn btn-primary btn-wide" on:click={copy(result())}>
          Copy result
        </button>

        <div class="divider" />
        <h2 class="text-2xl font-bold">Settings</h2>
        <label class="label" for="bg">Background Emoji</label>
        <input
          type="text"
          bind:value={bg}
          placeholder="Background emoji"
          id="bg"
          class="input input-bordered input-lg w-full max-w-xs"
        />
        <label class="label" for="width">Width ({width})</label>
        <input
          type="range"
          min="7"
          max="42"
          bind:value={width}
          class="range range-accent"
          id="width"
        />
      </div>
    </div>
  </div>
</div>
