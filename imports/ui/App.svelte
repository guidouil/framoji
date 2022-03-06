<script>
  import DeviceDetector from "svelte-device-detector";
  import vanillaToast from "vanilla-toast";
  const { EmojiButton } = require("@joeattardi/emoji-button");
  const copy = require("clipboard-copy");

  const inspirations = [
    {
      emoji: "🖼️",
      message: "This is a test, keep scrolling as natural as possible.",
    },
    { emoji: "🍔", message: "I Can Has 🍔?" },
    { emoji: "🌼", message: "🌼 powered" },
    { emoji: "🍎", message: "An 🍏 a day keep the 🧑‍⚕️ away" },
    { emoji: "🔲", message: "This is not 🚀 science" },
    {
      emoji: "🤔",
      message:
        "Some men see things as they are and ask, Why? I dream things that never were and ask, Why not?",
    },
    { emoji: "🟨", message: "I need more sticky notes" },
    { emoji: "🐈", message: "The Internet is made of 😸" },
    { emoji: "🟪", message: "May the force be with you" },
    { emoji: "💚", message: "Green is my favorite color" },
    {
      emoji: "🌹",
      message: "Roses are 🔴, Violets are 🔵. I like 🌧️, got no 🔍.",
    },
    { emoji: "❤️️", message: "Hold on, if ❤️️ is the answer your 🏠" },
    {
      emoji: "🧐",
      message: "I don't always use emojis, but when I do it's Framoji.",
    },
    { emoji: "🇺🇦", message: "Stop war" },
    {
      emoji: "☁️",
      message: "There is no ☁️, it's just someone else's 💻",
    },
    { emoji: "🤖", message: "I'm sorry, Dave. I'm afraid I can't do that." },
    {
      emoji: "💍",
      message:
        "One 💍 to rule them all, One 💍 to find them, One 💍 to bring them all and in the darkness bind them.",
    },
    {
      emoji: "🚲",
      message:
        "Life is like riding a 🚲. To keep your balance, you must keep moving.",
    },
    { emoji: "🤪", message: "Stupid is as stupid does" },
    { emoji: "🦖", message: "Do You Think He Saurus?" },
    { emoji: "🕵", message: "Who 👀 the Watchmen?" },
    { emoji: "🍾", message: "Save 💦 drink Champagne" },
    {
      emoji: "🙋",
      message: "3️⃣ clicks select the all line",
    },
    { emoji: "🐢", message: "I like turtles" },
    { emoji: "🦆", message: "What the duck?" },
  ];
  const randomIndex = Math.floor(Math.random() * inspirations.length);
  let { emoji, message } = inspirations[randomIndex];

  let width = 9;
  let showMargin = false;
  const spaceLength = 4.2;

  const visualLength = (line) => {
    const span = document.createElement("span");
    const text = document.createTextNode(line);
    span.appendChild(text);
    document.body.appendChild(span);
    const length = span.offsetWidth;
    document.body.removeChild(span);
    // console.log(length);
    return length;
  };

  $: result = () => {
    // top and bottom borders
    let border = "";
    for (let i = 0; i < width; i += 1) {
      border += emoji;
    }
    const borderLength = visualLength(border);
    const emojiLength = visualLength(emoji);
    const innerLength = borderLength - emojiLength * 2;
    // console.log({ borderLength, emojiLength, innerLength });

    // top and botton margins
    let margin = `\n${emoji}`;
    for (let i = 0; i < innerLength; i += spaceLength) {
      margin += " ";
    }
    margin += emoji;

    // cut message in lines
    let lines = [];
    const words = message.split(" ");
    let line = "";
    words.forEach((word, index) => {
      line += `${word} `;
      const lineLength = visualLength(line);
      if (lineLength >= innerLength - 60 || index === words.length - 1) {
        // border each side or last word
        lines.push(line.trim());
        line = "";
      }
    });
    // frame each line
    let framedLines = "";
    if (lines && lines.length > 0) {
      lines.forEach((line) => {
        let marge = "";
        let margeRight = "";
        const lineLength = visualLength(line);
        if (lineLength < innerLength) {
          const margeLength = (innerLength - lineLength) / 2;
          for (let i = 0; i < margeLength; i += spaceLength) {
            marge += " ";
          }
        }
        framedLines += `\n${emoji}${marge}${line}${marge}${emoji}`;
      });
    }
    if (showMargin) {
      return `${border}${margin}${framedLines}${margin}\n${border}`;
    }
    return `${border}${framedLines}\n${border}`;
  };

  const copyResult = () => {
    const result = document.getElementById("result").value;
    copy(`${result} \n#Framoji`);
    vanillaToast.success("Copied to clipboard");
  };

  const showEmojiPicker = () => {
    const picker = new EmojiButton();
    const trigger = document.querySelector("#emoji-trigger");
    picker.togglePicker(trigger);
    picker.on("emoji", (selection) => {
      emoji = selection.emoji;
      picker.destroyPicker();
      return true;
    });
  };
</script>

<div class="main">
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
      <div class="max-w-md">
        <h1
          on:click={() => location.reload()}
          class="text-center text-5xl font-bold"
        >
          Framoji&nbsp;{emoji}
        </h1>
        <p class="text-center">Write inside an emoji frame.</p>
        <p class="text-center">
          <small><em>Click header to reload</em></small>
        </p>

        <DeviceDetector showInDevice="desktop">
          <button
            class="btn btn-circle right-floated text-2xl"
            id="emoji-trigger"
            on:click={showEmojiPicker}
            >{emoji}
          </button>
        </DeviceDetector>
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
          rows="2"
        />

        <label class="label" for="result">Result</label>
        <textarea
          class="textarea textarea-primary"
          name="result"
          id="result"
          rows="6"
          cols={width * 2.7}
          value={result()}
        />
        <br />
        <button class="btn btn-primary btn-wide w-full" on:click={copyResult}>
          Copy result
        </button>
        <p class="text-center">
          <small>You can edit the result before copy.</small>
        </p>

        <label class="label" for="width">Width ({width})</label>
        <input
          type="range"
          min="4"
          max="42"
          bind:value={width}
          class="range range-accent"
          id="width"
        />
        <div class="form-control">
          <label class="label cursor-pointer">
            <input type="checkbox" class="toggle" bind:checked={showMargin} />
            <span class="label-text">Top and bottom margin</span>
          </label>
        </div>

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

<style>
  h1 {
    cursor: pointer;
  }
  .right-floated {
    float: right;
  }
</style>
