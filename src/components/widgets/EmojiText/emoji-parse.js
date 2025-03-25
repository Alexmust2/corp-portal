import data from "emoji-mart-vue-fast/data/all.json";
import { EmojiIndex } from "emoji-mart-vue-fast/src";
import { fromUtf16Array, toUtf16Array } from "./utf16";

let emojiIndex = new EmojiIndex(data);
let tree = null;

function addToTree(seq, e) {
  let p = tree;
  seq.forEach(ch => {
    if (p[ch] == null) p[ch] = {};
    p = p[ch];
  });
  p["."] = e;
}

function initTree() {
  if (tree == null) {
    tree = {};
    for (let k in emojiIndex._emojis) {
      let e = emojiIndex._emojis[k];
      if (!e.unified) continue;

      // Базовый вариант
      let baseSeq = e.unified.split("-");
      let last = baseSeq[baseSeq.length - 1];
      if (last === "fe0f" || last === "fe0e") {
        addToTree(baseSeq, e);
        addToTree(baseSeq.slice(0, -1), e);
      } else {
        addToTree(baseSeq, e);
      }

      // Скин-варианты
      if (e._skins && e._skins.length > 1) {
        for (let i = 1; i < e._skins.length; i++) {
          let skinEmoji = e._skins[i];
          let skinSeq = skinEmoji.unified.split("-");
          let lastSkin = skinSeq[skinSeq.length - 1];
          if (lastSkin === "fe0f" || lastSkin === "fe0e") {
            addToTree(skinSeq, e);
            addToTree(skinSeq.slice(0, -1), e);
          } else {
            addToTree(skinSeq, e);
          }
        }
      }
    }
  }
}

function traverseFindSeq(seq) {
  let p = tree;
  for (let i = 0; i < seq.length; i++) {
    let n = p[seq[i]];
    if (n == null) return null;
    p = n;
  }
  return p;
}

export function getTextAndEmojiRuns(s) {
  initTree();

  let runs = [];
  let chars = toUtf16Array(s);
  let i = 0;
  let len = chars.length;
  let seq = [];
  let text = [];

  function flush() {
    if (seq.length > 0) {
      let e = traverseFindSeq(seq);
      if (e && e["."]) {
        runs.push({ type: "emoji", seq: seq, emoji: e["."] });
      } else {
        text = [...text, ...seq.map(x => parseInt(x,16))];
      }
      seq = [];
    } else if (text.length > 0) {
      runs.push({ type: "text", chars: text, text: fromUtf16Array(text) });
      text = [];
    }
  }

  while (i < len) {
    let c = chars[i++];
    let cc = c.toString(16).toLowerCase();

    if (seq.length > 0) {
      let m = traverseFindSeq([...seq, cc]);
      if (m == null) {
        let m2 = traverseFindSeq(seq);
        if (m2 && m2["."] != null) {
          flush();
          i--;
        } else {
          text = [...text, ...seq.map(x => parseInt(x,16)), c];
          seq = [];
        }
      }
       else {
        seq.push(cc);
        continue;
      }
    } else {
      let m = traverseFindSeq([cc]);
      if (m == null) {
        text.push(c);
      } else {
        flush();
        seq = [cc];
      }
    }
  }
  flush();

  return runs;
}
