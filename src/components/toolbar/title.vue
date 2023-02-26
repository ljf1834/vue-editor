<template>
  <h2>设置标题</h2>
  <ul>
    <li v-for="h in hList" :key="h.type" @click="handle(h.type)">
      <i :style="{ fontSize: h.size }" :class="['iconfont', `icon-h-${h.icon}`]" v-if="h.icon" />
      <span :style="{ fontSize: h.size }" v-else>正文</span>
    </li>
  </ul>
</template>

<script lang="ts">
import store from '@/store';
export default {
  setup() {
    let hList = [
      {size: '2em', icon: '1', type: 'h1'},
      {size: '1.5em', icon: '2', type: 'h2'},
      {size: '1.17em', icon: '3', type: 'h3'},
      {size: '1em', icon: '4', type: 'h4'},
      {size: '.83em', icon: '5', type: 'h4'},
      {size: '1em', type: 'p'}
    ];
    const handle = (value) => store.commit('exec_command', { type: 'formatBlock', value });

    return { hList, handle }
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
