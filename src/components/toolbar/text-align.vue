<template>
  <h2>对齐方式</h2>
  <ul>
    <li v-for="align in alignList" :key="align.type" @click="handle(align.type)">{{ align.text }}</li>
  </ul>
</template>

<script lang="ts">
import store from '@/store';
export default {
  setup() {
    let alignList = [
      { type: 'alignLeft', text: '左对齐' },
      { type: 'alignRight', text: '右对齐' },
      { type: 'alignCenter', text: '居中对齐' },
      { type: 'alignJustify', text: '两端对齐' }
    ];

    const handle = (type) => store.commit('exec_command', { type });

    return { alignList, handle }
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
