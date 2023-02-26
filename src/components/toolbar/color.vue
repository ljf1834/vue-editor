<template>
  <div class="cus__select__color">
    <h4>
      <span>选择颜色</span>
      <i @click="handle('transparent')">无颜色</i>
    </h4>
    <ol>
      <li v-for="c in colorList" :key="c" :style="{ background: c }" @click="handle(c)"></li>
    </ol>
  </div>
</template>

<script lang="ts">
import store from '@/store';

export default {
  setup() {
    let colorList = [
      'rgb(0, 0, 0)', 'rgb(247, 103, 6)', 'rgb(245, 158, 0)', 'rgb(116, 184, 22)', 'rgb(6, 166, 120)', 'rgb(16, 152, 173)', 'rgb(29, 125, 215)', 'rgb(112, 71, 231)', 'rgb(173, 62, 201)', 'rgb(240, 61, 63)',
      'rgb(223, 227, 232)', 'rgb(255, 169, 76)', 'rgb(254, 212, 59)', 'rgb(170, 227, 76)', 'rgb(55, 217, 168)', 'rgb(59, 200, 219)', 'rgb(77, 173, 247)', 'rgb(151, 117, 250)', 'rgb(218, 119, 242)', 'rgb(255, 135, 135)',
      'rgb(255, 255, 255)', 'rgb(255, 232, 204)', 'rgb(255, 242, 190)', 'rgb(233, 250, 200)', 'rgb(195, 250, 232)', 'rgb(196, 246, 250)', 'rgb(204, 237, 255)', 'rgb(229, 219, 255)', 'rgb(244, 217, 250)', 'rgb(254, 227, 226)'
    ];
    const handle = (value) => store.commit('exec_command', { type: store.state.currentType, value });
    return { colorList, handle }
  }
}
</script>

<style lang="scss" scoped>
.cus__select__color {
  width: 270px;
  padding: 0 16px;
  h4 {
    display: flex;
    font-weight: 400;
    i {
      margin-left: auto;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: #1AAFA7;
      }
    }
  }
  ol {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(10,10%);
    grid-row-gap: 10px;
    grid-column-gap: 0;
    flex-flow: row wrap;
    justify-content: space-between;
    li {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      cursor: pointer;
      transition: transform .2s;
      &:nth-child(21) {
        border: solid 1px #ccc;
      }
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
</style>
