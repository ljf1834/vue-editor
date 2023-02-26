<template>
  <div class="cus__select__table">
    <p><span>{{ checked.row }}</span><span>x</span><span>{{ checked.col }}</span><span>表格</span></p>
    <ul>
      <li v-for="i in (12 * 12)" :key="i"
        :class="{ 'is__checked': checked.row >= i / 12 && checked.col >= (i % 12 || 12) }"
        @mouseenter="mouseenter(i)"
        @click="handle"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { reactive } from 'vue';
import store from '@/store';

export default {
  setup() {
    let checked = reactive({
      row: 0,
      col: 0
    })
    const mouseenter = (index) => {
      let n = ~~(index / 12)
      checked.row = n + (n === index / 12 ? 0 : 1);
      checked.col = index % 12 || 12;
    }
    const handle = () => store.commit('exec_command', { type: 'table', value: { ...checked } });

    return { mouseenter, checked, handle }
  }
}
</script>

<style lang="scss" scoped>
.cus__select__table {
  width: 280px;
  padding: 0 16px;
  & > p {
    font-size: 12px;
    margin-bottom: 10px;
    span {
      margin-right: 3px;
    }
  }
  ul {
    display: grid;
    grid-template-columns: repeat(12, 8.33%);
    grid-row-gap: 3px;
    grid-column-gap: 0;
    flex-flow: row wrap;
    justify-content: space-between;
    li {
      width: 18px;
      height: 18px;
      border-radius: 3px;
      cursor: pointer;
      border: solid 1px #ccc;
      &.is__checked {
        background: rgba($color: #448aff, $alpha: .2);
        border-color: rgba($color: #448aff, $alpha: .5);
      }
    }
  }
}
</style>
