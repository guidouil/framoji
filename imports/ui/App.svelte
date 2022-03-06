<script>
  import DeviceDetector from "svelte-device-detector";
  import vanillaToast from "vanilla-toast";
  import { EmojiButton } from "@joeattardi/emoji-button";
  import copy from "clipboard-copy";
  import GraphemeSplitter from "grapheme-splitter";

  const inspirations = [
    {
      emoji: "🖼️",
      message: "This is a test, keep scrolling as natural as possible.",
    },
    { emoji: "🍔", message: "I Can Has 🍔?" },
    { emoji: "🌼🌻🌸", message: "Powered" },
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
  let emoji;
  let message;
  let emojis;

  const splitEmojis = () => {
    const splitter = new GraphemeSplitter();
    emojis = splitter.splitGraphemes(emoji);
    if (emojis.length > 4) {
      vanillaToast.error("Maximum 4 emojis");
      emojis.length = 4;
      emoji = emojis.join("");
    }
  };

  const getInspired = () => {
    const randomIndex = Math.floor(Math.random() * inspirations.length);
    emoji = inspirations[randomIndex].emoji;
    message = inspirations[randomIndex].message;
    splitEmojis();
  };
  getInspired();

  let width = 9;
  let showMargin = false;
  const spaceLength = 4.2; // because 42 / 10 🤯

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
    let result = "";
    // top and bottom borders
    let borders = [];
    for (let emojisIndex = 0; emojisIndex < emojis.length; emojisIndex += 1) {
      let border = "";
      for (let i = 0; i < width; i += 1) {
        if (i === 0 || i === width - 1) {
          border += emojis[0];
        } else if (
          emojisIndex > 0 &&
          emojis[1] &&
          (i === 1 || i === width - 2)
        ) {
          border += emojis[1];
        } else if (
          emojisIndex > 1 &&
          emojis[2] &&
          (i === 2 || i === width - 3)
        ) {
          border += emojis[2];
        } else {
          border += emojis[emojisIndex];
        }
      }
      borders.push(`${border}\n`);
    }
    const borderLength = visualLength(borders[0]);
    const emojiLength = visualLength(emoji);
    const innerLength = borderLength - emojiLength * 2;
    // console.log({ borderLength, emojiLength, innerLength });

    // top and botton margins
    let margin = `${emoji}`;
    for (let i = 0; i < innerLength; i += spaceLength) {
      margin += " ";
    }
    emojis.reverse();
    margin += emojis.join("");
    emojis.reverse();
    margin += "\n";

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
        let framedLine = "";
        let marge = "";
        const lineLength = visualLength(line);
        if (lineLength < innerLength) {
          const margeLength = (innerLength - lineLength) / 2;
          for (let i = 0; i < margeLength; i += spaceLength) {
            marge += " ";
          }
        }
        framedLine += `${emoji}${marge}${line}${marge}`;
        emojis.reverse();
        framedLine += emojis.join("");
        emojis.reverse();
        framedLines += `${framedLine}\n`;
      });
    }
    if (showMargin) {
      borders.forEach((border) => {
        result += border;
      });
      result += margin;
      result += framedLines;
      result += margin;
      borders.reverse();
      borders.forEach((border) => {
        result += border;
      });
    } else {
      borders.forEach((border) => {
        result += border;
      });
      result += framedLines;
      borders.reverse();
      borders.forEach((border) => {
        result += border;
      });
    }
    return result;
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
      emoji += selection.emoji;
      picker.destroyPicker();
      splitEmojis();
      return true;
    });
  };
</script>

<div class="main">
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content">
      <div class="max-w-lg">
        <nav class="heading" on:click={getInspired}>
          <h1 class="text-center text-5xl font-bold">
            Framoji{#if emojis[0]}&nbsp;{emojis[0]}{/if}
          </h1>
          <p class="text-center">Write inside an emoji frame.</p>
          <p class="text-center">
            <small><em>Click header to get inspired.</em></small>
          </p>
        </nav>

        <DeviceDetector showInDevice="desktop">
          <button
            class="btn btn-circle right-floated text-2xl"
            id="emoji-trigger"
            on:click={showEmojiPicker}
          >
            🙂
          </button>
        </DeviceDetector>
        <label class="label" for="emoji">Emoji(s)</label>
        <input
          type="text"
          bind:value={emoji}
          on:input={splitEmojis}
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
  .heading {
    cursor: pointer;
    user-select: none;
  }
  .right-floated {
    float: right;
  }
</style>
