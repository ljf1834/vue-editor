<template>
  <h2>设置字号</h2>
  <ul>
    <li v-for="(size, idx) in sizeList" :key="size" @click="handle(idx + 1)">{{ size }}px</li>
  </ul>
</template>

<script lang="ts">
import store from '@/store';
export default {
  setup() {
    let sizeList = [ 12, 14, 16, 18, 24, 32, 48 ];

    const handle = (value) => store.commit('exec_command', { type: 'fontSize', value });

    return { sizeList, handle }
  }
}
</script>

<style lang="scss" scoped>
ul {
  width: 90px;
  li {
    padding: 6px 0;
    line-height: 1;
    text-align: center;
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
