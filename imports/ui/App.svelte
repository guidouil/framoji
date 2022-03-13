<script>
  import DeviceDetector from "svelte-device-detector";
  import vanillaToast from "vanilla-toast";
  import { EmojiButton } from "@joeattardi/emoji-button";
  import copy from "clipboard-copy";
  import GraphemeSplitter from "grapheme-splitter";

  import { initializeApp } from "firebase/app";
  import { getFirestore, collection, addDoc } from "firebase/firestore/lite";

  const firebaseConfig = {
    apiKey: "AIzaSyCxfEDdH1fbkRp_VRWTHLRwclxGuXLoYy4",
    authDomain: "framoji-0.firebaseapp.com",
    projectId: "framoji-0",
    storageBucket: "framoji-0.appspot.com",
    messagingSenderId: "287829073953",
    appId: "1:287829073953:web:d9185c22baa8e60a994360",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  import { inspirations } from "../api/inspirations.js";

  import NavBar from "./NavBar.svelte";

  const replaceAt = (string, index, replacement) =>
    string.substr(0, index) +
    replacement +
    string.substr(index + replacement.length);

  let emoji;
  let emojis;
  let message;
  let width = 9;
  let showMargin = false;
  let currentIndex;

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
    if (inspirations && inspirations.length > 0) {
      let newIndex = Math.floor(Math.random() * inspirations.length);
      if (newIndex === currentIndex) {
        getInspired();
      } else {
        currentIndex = newIndex;
      }
      emoji = inspirations[currentIndex].emoji;
      message = inspirations[currentIndex].message;
      splitEmojis();
    }
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
  const spaceLength = visualLength("_ _") - visualLength("__");

  const replacePointingEmojis = (emojisString, direction) => {
    const emojisToReplace = ["👇", "⬇️", "▶️", "🔽", "⏬", "⤵️", "↕️"];
    const found = emojisToReplace.some((emojiToReplace) =>
      emojis.includes(emojiToReplace)
    );
    if (!found) return emojisString;
    let result = emojisString;
    switch (direction) {
      case "right":
        result = emojisString
          .replaceAll("👇", "👉")
          .replaceAll("⬇️", "➡️")
          .replaceAll("▶️", "⏭️")
          .replaceAll("🔽", "▶️")
          .replaceAll("⏬", "⏩")
          .replaceAll("⤵️", "↪️")
          .replaceAll("↕️", "↔️");
        break;
      case "left":
        result = emojisString
          .replaceAll("👇", "👈")
          .replaceAll("⬇️", "⬅️")
          .replaceAll("▶️", "⏮️")
          .replaceAll("🔽", "◀️")
          .replaceAll("⏬", "⏪")
          .replaceAll("⤵️", "↩️")
          .replaceAll("↕️", "↔️");
        break;
      case "up":
        result = emojisString
          .replaceAll("👇", "👆")
          .replaceAll("⬇️", "⬆️")
          .replaceAll("▶️", "⏏️")
          .replaceAll("🔽", "🔼")
          .replaceAll("⏬", "⏫")
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
    for (let i = 0; i < innerLength - spaceLength; i += spaceLength) {
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
      if (
        (words[index + 1] &&
          visualLength(words[index + 1]) + lineLength + 4 * spaceLength >
            innerLength) ||
        index === words.length - 1 // last word
      ) {
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

  const setInspiration = (index) => {
    currentIndex = index;
    emoji = inspirations[index].emoji;
    message = inspirations[index].message;
    splitEmojis();
  };

  const submitInspiration = () => {
    const author = prompt("What is your name/pseudo?");
    if (author) {
      const docRef = addDoc(collection(db, "inspirations"), {
        emoji,
        message,
        author,
      });
      vanillaToast.success("Inspiration submited");
      console.log(docRef);
    }
  };
</script>

<div class="main min-h-screen bg-base-200">
  <NavBar {emojis} {getInspired} />
  <div class="flex items-center justify-center mt-2">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- First column -->
      <div class="max-w-xs mx-auto">
        <div class="md:sticky md:top-0">
          <DeviceDetector showInDevice="desktop">
            <button
              class="btn btn-circle right-floated text-2xl"
              id="emoji-trigger"
              on:click={showEmojiPicker}
            >
              🙂
            </button>
          </DeviceDetector>
          <label class="label" for="emoji">
            Emoji(s) for the frame <br />
          </label>
          <input
            type="text"
            bind:value={emoji}
            on:input={splitEmojis}
            class="input input-bordered input-lg w-full max-w-xs"
            id="emoji"
            placeholder="Frame emojis"
          />
          <label class="label" for="emoji">
            <span class="label-text-alt" />
            <span class="label-text-alt">Try 👇 and ⬇️</span>
          </label>
          <p class="text-center" />
          <label class="label" for="message">Message in the frame</label>
          <textarea
            class="textarea w-full max-w-xs"
            bind:value={message}
            id="message"
            rows="3"
            placeholder="Text inside the frame"
          />
          <label class="label" for="result">Result</label>
          <textarea
            class="textarea textarea-primary w-full max-w-xs"
            name="result"
            id="result"
            rows="9"
            value={result()}
          />
          <br />
          <button class="btn btn-primary w-full" on:click={copyResult}>
            Copy result
          </button>
          <p class="text-center">
            <small>You can edit the result before copy.</small>
          </p>
          <label class="label" for="width">Width ({width})</label>
          <input
            type="range"
            min="3"
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
          <p class="text-center">Do you like what you've created?</p>
          <button
            class="btn btn-sm btn-secondary w-full"
            on:click={submitInspiration}>Submit this inspiration</button
          >
        </div>
      </div>
      <!-- Second column -->
      <div class="max-w-md">
        <div class="overflow-x-auto">
          <h2 class="text-xl">Inspirations 👇</h2>
          <table class="table w-full">
            <!-- head -->
            <thead>
              <tr>
                <th>Emoji(s)</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              <!-- rows -->
              {#each inspirations as { emoji, message }, index}
                <tr
                  class="hover"
                  class:active={index === currentIndex}
                  on:click={() => setInspiration(index)}
                >
                  <td>{emoji}</td>
                  <td>{message}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  <div class="divider" />
  <p class="text-center">
    <a class="link" href="https://github.com/guidouil/framoji" target="_blank">
      View source
    </a>
  </p>
  <br />
</div>

<style>
  tr {
    cursor: pointer;
    user-select: none;
  }
  .right-floated {
    float: right;
  }
</style>
