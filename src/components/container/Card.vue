<script lang="ts">
import {defineComponent, ref, watchEffect} from 'vue'
import * as md_renderer from './renderer'

export default defineComponent({
  name: "Card",
  setup(props) {
    const revealed = ref<boolean>(false)
    const rendered = ref<string>('')

    watchEffect(() => {
      rendered.value = md_renderer.md_render(props.content)
    })

    return {
      revealed,
      rendered
    }
  },
  props: {
    content: {
      type: String,
      required: true,
    },
    contrib: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    sensitive: {
      type: Boolean,
      required: true,
    },
    unsure: {
      type: Boolean,
      required: true,
    },
    hidden: {
      type: Boolean,
      required: true,
    },
  },
})
</script>

<template>
  <div :class="{ 'sensitive' : sensitive, 'entry': true, 'revealed': revealed, 'hidden': hidden }">
    <div :class="{ 'sensitive-box': sensitive, 'revealed': revealed }">
      <div class="entry-header">
        <div style="display: flex; align-items: center;">
          <span class="entry-time">{{ time }}</span>
          <span class="entry-contributor" style="margin-left: 10px;">{{ contrib }}</span>
        </div>
        <span class="entry-unsure" v-if="unsure">本条目真实性有待考究</span>
      </div>
      <div v-html="rendered"></div>
    </div>
    <div class="sensitive-warning" v-if="sensitive">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none"/>
        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
      </svg>
      <span style="display: inline-block; vertical-align: middle;">This content contains sensitive information.</span>
      <button class="show-button" @click="revealed = true">Show</button>
    </div>
  </div>
</template>

<style scoped>
.entry {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 15px;
  background-color: #e7f3ff;
  border-radius: 12px;
  border-style: solid;
  border-color: #07f5ed;
  border-width: 2px;
  word-wrap: break-word;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  min-height: 80px;
}
.entry.hidden {
  border-style: dashed;
  border-width: 2px;
}
.entry:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  min-height: 20px;
}
.entry-time, .entry-contributor {
  font-size: 0.8em;
  color: #aaa;
}
.entry-unsure {
  color: #FFA500;
  font-weight: bold;
  font-size: 1.1em;
  margin-left: 10px;
}
.entry.sensitive {
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  min-height: 80px;
}
.sensitive-box {
  filter: blur(10px);
  position: relative;
  overflow: hidden;
}
.sensitive-box.revealed {
  filter: none;
}
.entry.sensitive.revealed {
  filter: none;
}
.sensitive-warning {
  position: absolute;
  text-align: left;
  pointer-events: auto;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  padding:25px;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: none;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  backdrop-filter: blur(5px);
}
.sensitive-warning svg {
  vertical-align: middle;
  margin-right: 5px;
}
.entry.revealed .sensitive-warning {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.show-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(5, 4, 4, 0.5);
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  padding: 8px 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
}
</style>