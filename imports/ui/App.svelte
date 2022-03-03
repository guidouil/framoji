<script>
  const copy = require("clipboard-copy");

  const inspirations = [
    {
      emoji: "🖼️",
      message: "This is a test. Keep on scrolling as natural as possible.",
    },
    { emoji: "🍔", message: "I Can Has Cheezburger?" },
    { emoji: "🌼", message: "Flower Power" },
    { emoji: "🍎", message: "An emoji a day keep the clouds away" },
    { emoji: "🚀", message: "This is not rocket science" },
    {
      emoji: "🤔",
      message:
        "Some men see things as they are and ask, Why? I dream things that never were and ask, Why not?",
    },
    { emoji: "🟨", message: "I need more sticky notes" },
    { emoji: "🐈", message: "The Internet is made of cats" },
    { emoji: "🟪", message: "May the force be with you" },
    { emoji: "🟩", message: "Green is my favorite color" },
    {
      emoji: "🌹",
      message: "Roses are red, Violets are blue. I like rain, got no clue.",
    },
    { emoji: "❤️️", message: "Hold On, If Love Is The Answer Your Home." },
    {
      emoji: "🧐",
      message: "I don't always use emojis, but when I do it's Framoji.",
    },
    { emoji: "🇺🇦", message: "Not only thoughts and prayers" },
    {
      emoji: "☁️",
      message: "There is no cloud, it's just someone else's computer",
    },
    { emoji: "🤖", message: "I'm sorry, Dave. I'm afraid I can't do that." },
    {
      emoji: "💍",
      message:
        "One Ring to rule them all, One Ring to find them, One Ring to bring them allu and in the darkness bind them.",
    },
    {
      emoji: "🚲",
      message:
        "Life is like riding a bicycle. To keep your balance, you must keep moving.",
    },
  ];
  const randomIndex = Math.floor(Math.random() * inspirations.length);
  let { emoji, message } = inspirations[randomIndex];

  const backgrounds = [
    "⬜",
    "⬛️",
    "🔲",
    "◻️",
    "◽",
    "◼️",
    "◾",
    "🟨",
    "🟪",
    "🟧",
    "🟩",
    "🟫",
    "🟦",
    "🟥",
  ];
  const randomBgIndex = Math.floor(Math.random() * backgrounds.length);
  let bg = backgrounds[randomBgIndex];

  let width = 9;
  let showMargin = true;

  const makeLines = (message, width) => {
    let lines = [];
    const wordsPerLine = Math.round((width - 2) / 3);
    const words = message.split(" ");
    if (words && words.length > 0) {
      // join short words
      words.forEach((word, i) => {
        if (word.length <= 2 && words[i + 1] && words[i + 1].length <= 2) {
          words[i] += ` ${words[i + 1]}`;
          words.splice(i + 1, 1);
        }
      });
      let line = "";
      words.forEach((word, index) => {
        line += `${word} `;
        if ((index + 1) % wordsPerLine === 0 || index === words.length - 1) {
          lines.push(line.trim());
          line = "";
        }
      });
    }
    return lines;
  };
  $: lines = makeLines(message, width);

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
    if (lines && lines.length > 0) {
      lines.forEach((line) => {
        const leftMargeCount = Math.floor((width - 2 - line.length / 3) / 2);
        let leftMarge = "";
        if (leftMargeCount > 0) {
          for (let i = 0; i < leftMargeCount; i += 1) {
            leftMarge += bg;
          }
        }
        const rightMargeCount = Math.round((width - 2 - line.length / 3) / 2);
        let rightMarge = "";
        if (rightMargeCount > 0) {
          for (let i = 0; i < rightMargeCount; i += 1) {
            rightMarge += bg;
          }
        }
        framedLines += `\n${emoji}${leftMarge}${line}${rightMarge}${emoji}`;
      });
    }
    if (showMargin) {
      return `${border}${margin}${framedLines}${margin}\n${border}`;
    }
    return `${border}${framedLines}\n${border}`;
  };
</script>

<div class="main">
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
      <div class="max-w-md">
        <h1 class="text-center text-5xl font-bold">Framoji {emoji}</h1>
        <p class="text-center">Put some lines inside an emoji frame</p>
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
        <textarea
          class="textarea w-full max-w-xs"
          bind:value={message}
          rows={Math.round(lines.length / 2)}
        />

        <label class="label" for="result">Result</label>
        <textarea
          class="textarea textarea-primary"
          name="result"
          id="result"
          rows={lines.length + 4}
          cols={width * 2.7}
          value={result()}
        />
        <br />
        <button
          class="btn btn-primary btn-wide"
          on:click={copy(`${result()}\n#Framoji`)}
        >
          Copy result
        </button>

        <div class="divider" />
        <h2 class="text-2xl font-bold">Settings</h2>
        <div class="form-control">
          <label class="label cursor-pointer">
            <input type="checkbox" class="toggle" bind:checked={showMargin} />
            <span class="label-text">Top and bottom margin</span>
          </label>
        </div>
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
          min="4"
          max="42"
          bind:value={width}
          class="range range-accent"
          id="width"
        />

        <p class="text-center">Reload for inspiration...</p>
        <div class="divider" />
        <p class="text-center">
          <a href="https://github.com/guidouil/framoji" target="_blank">
            GitHub
          </a>
        </p>
      </div>
    </div>
  </div>
</div>
