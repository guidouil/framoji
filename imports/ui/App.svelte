<script>
  const { EmojiButton } = require("@joeattardi/emoji-button");
  const copy = require("clipboard-copy");

  const inspirations = [
    {
      emoji: "🖼️",
      message: "This is a test, keep on scrolling as natural as possible.",
    },
    { emoji: "🍔", message: "I Can Has 🍔?" },
    { emoji: "🌼", message: "🌼 powered" },
    { emoji: "🍎", message: "An 🍏 a day keep the 🧑‍⚕️ away" },
    { emoji: "☄️", message: "This is not 🚀 science" },
    {
      emoji: "🤔",
      message:
        "Some men see things as they are and ask, Why? I dream things that never were and ask, Why not?",
    },
    { emoji: "🟨", message: "I need more sticky 🗒️" },
    { emoji: "🐈", message: "The Internet is made of 😸" },
    { emoji: "🙏", message: "May the force be with you" },
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
    { emoji: "🇺🇦", message: "🕊️ & ❤️" },
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
  ];
  const randomIndex = Math.floor(Math.random() * inspirations.length);
  let { emoji, message } = inspirations[randomIndex];

  let width = 9;
  let showMargin = false;
  const spaceLength = 4; // width of a space char in pixels

  // This is insane or genius...
  const visualLength = (line) => {
    const smallText = document.createElement("small");
    smallText.innerText = line;
    const longText = document.createElement("span");
    const text = document.createTextNode(line);
    longText.appendChild(text);
    document.body.appendChild(smallText);
    document.body.appendChild(longText);
    const length = (smallText.offsetWidth + longText.offsetWidth) / 2;
    document.body.removeChild(smallText);
    document.body.removeChild(longText);
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
      if (lineLength >= innerLength - 54 || index === words.length - 1) {
        // border each side or last word
        lines.push(line.trim());
        line = "";
      }
    });
    // frame each line
    let framedLines = "";
    if (lines && lines.length > 0) {
      lines.forEach((line) => {
        let margeLeft = "";
        let margeRight = "";
        const lineLength = visualLength(line);
        if (lineLength < innerLength) {
          const margeLengthLeft = Math.round((innerLength - lineLength) / 2);
          const margeLengthRight = Math.floor((innerLength - lineLength) / 2);
          // console.log({ margeLengthLeft, margeLengthRight });
          for (let i = 0; i < margeLengthLeft; i += spaceLength) {
            margeLeft += " ";
          }
          for (let i = 0; i < margeLengthRight; i += spaceLength) {
            margeRight += " ";
          }
        }
        framedLines += `\n${emoji}${margeLeft}${line}${margeRight}${emoji}`;
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
    alert("Copied to clipboard");
  };

  const picker = new EmojiButton();
  const showEmojiPicker = () => {
    const trigger = document.querySelector("#emoji-trigger");
    picker.togglePicker(trigger);
    picker.on("emoji", (selection) => {
      emoji = selection.emoji;
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
          Framoji {emoji}
        </h1>
        <p class="text-center">Write inside an emoji frame.</p>
        <p class="text-center">
          <small><em>Click header to reload</em></small>
        </p>

        <button
          class="btn btn-circle right-floated text-xl"
          id="emoji-trigger"
          on:click={showEmojiPicker}
          >{emoji}
        </button>
        <label class="label" for="emoji">Emoji</label>
        <input
          type="text"
          bind:value={emoji}
          placeholder="Frame emoji"
          id="emoji"
          class="input input-bordered w-full max-w-xs"
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
          <small>You can edit result before copy.</small>
        </p>

        <!-- <div class="divider" /> -->
        <!-- <h2 class="text-2xl font-bold">Settings</h2> -->
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
