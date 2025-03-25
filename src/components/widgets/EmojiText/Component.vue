<template>
  <span>
    <span v-for="(run, i) in runs" :key="'run' + i">
      <span v-if="run.type === 'text'">{{ run.text }}</span>
      <Emoji
        v-else
        :emoji="run.emoji"
        :skin="run.emoji.skin"
        :set="set"
        size="20"
      />
    </span>
  </span>
</template>

<script>
import { defineComponent, computed } from "vue";
import { Emoji } from "emoji-mart-vue-fast/src";
import { getTextAndEmojiRuns } from "./emoji-parse";

export default defineComponent({
  name: "EmojiText",
  components: {
    Emoji,
  },
  props: {
    text: {
      type: String,
      default: "",
    },
    set: {
      type: String,
      default: undefined,
    },
    size: {
      type: [String, Number],
      default: undefined,
    },
  },
  setup(props) {
    const runs = computed(() => getTextAndEmojiRuns(props.text));
    return { runs };
  },
});
</script>

<style scoped>
.emoji-mart-emoji {
  padding: 0px 3px !important;
  height: 20px !important;
  vertical-align: text-bottom;
}
</style>
