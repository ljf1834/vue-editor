<template>
  <h2>设置字体</h2>
  <ul>
    <li v-for="family in familyList" :key="family" @click="handle(family)">{{ family }}</li>
  </ul>
</template>

<script lang="ts">
import store from '@/store';

export default {
  setup() {
    let familyList = [ '宋体', '黑体', '微软雅黑', '仿宋', '楷体', 'Arail', 'Times New Roman' ];

    const handle = (value) => store.commit('exec_command', { type: 'fontName', value });

    return { familyList, handle }
  }
}
</script>

<style lang="scss" scoped>
ul {
  width: 150px;
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
