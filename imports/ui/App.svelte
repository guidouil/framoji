<script>
  import DeviceDetector from "svelte-device-detector";
  import vanillaToast from "vanilla-toast";
  import { EmojiButton } from "@joeattardi/emoji-button";
  import copy from "clipboard-copy";
  import GraphemeSplitter from "grapheme-splitter";

  import { inspirations } from "../api/inspirations.js";

  const replaceAt = (string, index, replacement) =>
    `${string.substr(0, index)}${replacement}${string.substr(
      index + replacement.length
    )}`;

  let emoji;
  let message;
  let emojis;
  let width = 9;
  let showMargin = true;
  const spaceLength = 4.2; // because 42 / 10 🤯

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

  const visualLength = (line) => {
    const span = document.createElement("span");
    const text = document.createTextNode(line);
    span.appendChild(text);
    document.body.appendChild(span);
    const length = span.offsetWidth;
    document.body.removeChild(span);
    return length;
  };

  const replacePointingEmojis = (emojisString, direction) => {
    let result = emojisString;
    switch (direction) {
      case "right":
        result = emojisString
          .replaceAll("👇", "👉")
          .replaceAll("⬇️", "➡️")
          .replaceAll("🔽", "▶️")
          .replaceAll("⏬", "⏩")
          .replaceAll("⏯️", "⏭️")
          .replaceAll("↕️", "↔️")
          .replaceAll("⤵️", "↪️");
        break;
      case "left":
        result = emojisString
          .replaceAll("👇", "👈")
          .replaceAll("⬇️", "⬅️")
          .replaceAll("🔽", "◀️")
          .replaceAll("⏬", "⏪")
          .replaceAll("⏯️", "⏮️")
          .replaceAll("↕️", "↔️")
          .replaceAll("⤵️", "↩️");
        break;
      case "up":
        result = emojisString
          .replaceAll("👇", "👆")
          .replaceAll("⬇️", "⬆️")
          .replaceAll("🔽", "🔼")
          .replaceAll("⏬", "⏫")
          .replaceAll("⏯️", "⏏️")
          .replaceAll("⤵️", "⤴️");
        break;
      default:
        break;
    }
    if (result.indexOf("⬇️") !== -1) {
      result = replaceAt(result, result.indexOf("⬇️"), "↘️");
      result = replaceAt(result, result.lastIndexOf("⬇️"), "↙️");
    }
    if (result.indexOf("⬆️") !== -1) {
      result = replaceAt(result, result.indexOf("⬆️"), "↗️");
      result = replaceAt(result, result.lastIndexOf("⬆️"), "↖️");
    }
    console.log(result);
    return result;
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
    let margin = replacePointingEmojis(emojis.join(""), "right");
    for (let i = 0; i < innerLength; i += spaceLength) {
      margin += " ";
    }
    emojis.reverse();
    margin += replacePointingEmojis(emojis.join(""), "left");
    emojis.reverse();
    margin += "\n";
    // cut message in lines
    let lines = [];
    const words = message.split(" ");
    let line = "";
    words.forEach((word, index) => {
      line += `${word} `;
      const lineLength = visualLength(line);
      if (lineLength > innerLength - 60 || index === words.length - 1) {
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
        framedLine += replacePointingEmojis(emojis.join(""), "right");
        framedLine += `${marge}${line}${marge}`;
        emojis.reverse();
        framedLine += replacePointingEmojis(emojis.join(""), "left");
        emojis.reverse();
        framedLines += `${framedLine}\n`;
      });
    }
    borders.forEach((border) => {
      result += replacePointingEmojis(border, "down");
    });
    if (showMargin) {
      result += margin;
    }
    result += framedLines;
    if (showMargin) {
      result += margin;
    }
    borders.reverse();
    borders.forEach((border) => {
      result += replacePointingEmojis(border, "up");
    });
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
      copy(selection.emoji);
      vanillaToast.success("Emoji copied");
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
          <p class="text-center">Write inside an emojis frame</p>
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
          class="input input-bordered input-lg w-full max-w-xs"
          id="emoji"
          placeholder="Frame emojis"
        />
        <label class="label" for="message">Message</label>
        <textarea
          class="textarea w-full max-w-xs"
          bind:value={message}
          id="message"
          rows="2"
          placeholder="Text inside the frame"
        />
        <label class="label" for="result">Result</label>
        <textarea
          class="textarea textarea-primary"
          name="result"
          id="result"
          rows="8"
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
