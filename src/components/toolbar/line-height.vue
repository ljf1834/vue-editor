<template>
  <h2>设置行高</h2>
  <ul>
    <li v-for="item in lineHeightList" @click="handle(item)">{{ item }}</li>
  </ul>
</template>

<script lang="ts">
import { ref } from 'vue';
import store from '@/store';

export default {
  setup() {
    let lineHeightList = [1, 1.15, 1.5, 2, 2.5, 3];

    const handle = (value) => store.commit('exec_command', { type: 'lineHeight', value })

    return { lineHeightList, handle }
  }
}
</script>

<style lang="scss" scoped>
ul {
  width: 90px;
  li {
    padding: 6px 0;
    line-height: 1;
    text-indent: 2em;
    color: #555;
    font-size: 13px;
    cursor: pointer;
    &:hover {
      background: #f1f1f1;
    }
    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
