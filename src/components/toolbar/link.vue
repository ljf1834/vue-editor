<template>
  <h2>链接</h2>
  <div class="cus__insert__link">
    <input type="text" v-model="link.text" placeholder="请输入链接文字">
    <input type="text" v-model="link.url" placeholder="请输入链接地址（如：https://...）">
    <a href="javascript:;" @click="insert">插入</a>
  </div>
</template>

<script lang="ts">
import { reactive, watch } from 'vue'
import store from '@/store';
export default {
  setup() {
    let link = reactive({
      url: '',
      text: __getText(store.state.currentRange!)
    });

    watch(() => store.state.currentRange, (range) => link.text = __getText(range!))

    const insert = () => store.commit('exec_command', { type: 'link', value: link });

    return { link, insert }
  }
}

const __getText = ({ collapsed, startContainer, endContainer, startOffset, endOffset }): string => {
  if (collapsed) {
    return startContainer.textContent;
  }
  let text = '';
  if (startContainer.nodeName === '#text') {
    text += startContainer.textContent.substring(startOffset);
  }
  if (startContainer !== endContainer && endContainer.nodeName === '#text') {
    text += endContainer.textContent.substr(0, endOffset);
  }
  return text;
}
</script>

<style lang="scss" scoped>
.cus__insert__link {
  width: 260px;
  padding: 0 16px;
  input {
    display: block;
    width: 100%;
    padding: 6px 10px;
    margin-bottom: 10px;
    outline: none;
    border: 0;
    border-bottom: solid 1px #ccc;
    box-sizing: border-box;
    &:focus {
      border-bottom-color: #1AAFA7;
    }
  }
  a {
    display: block;
    float: right;
    color: #1AAFA7;
    &:active {
      opacity: .8;
    }
  }
}
</style>
