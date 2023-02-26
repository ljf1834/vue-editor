<template>
  <div class="cus__editable__item" ref="editableRef">
    <div class="cus__editable__content"
      v-table-resize
      v-image-resize
      ref="contentRef"
      :contenteditable="contenteditable"
      spellcheck="false"
      @keyup="saveRange"
      @paste="paste"
      @click="saveRange"
      @focus="onFocus"
      @blur="$emit('blur')"
    />
    <div class="cus__editor__placeholder" v-show="showPlaceholder">{{ placeholder }}</div>
  </div>
</template>

<script lang="ts">
import { ref, PropType, onMounted } from 'vue';
import store from '@/store';
import ImageResizeDirective from '@/directives/image-resize.directive';
import TableResizeDirective from '@/directives/table-resize.directive';

import { defaultText } from '$/const';
import { setAutoSize, onHtmlChange } from '$';
import { onPaste } from '$/paste';

export default {
  name: 'editor-item',
  props: {
    modelValue: {
      type: String,
      default: defaultText
    },
    placeholder: {
      type: String,
      default: '请输入正文'
    },
    autosize: {
      type: [Number, Object] as PropType<number | { minRows: number, maxRows: number }>,
      default: 4
    },
    contenteditable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['focus', 'blur', 'update:modelValue'],
  directives: { 'image-resize': ImageResizeDirective, 'table-resize': TableResizeDirective },
  setup(props, { emit }) {
    const editableRef = ref<HTMLDivElement | null>(null);
    const contentRef = ref<HTMLDivElement | null>(null);

    onMounted(() => {
      contentRef.value!.innerHTML = props.modelValue;

      setAutoSize(props.autosize, contentRef.value!);

      /* -------------  监听 编辑器内容 变更 ------------- */
      onHtmlChange(contentRef.value!, (value) => {
        emit('update:modelValue', value);
        showPlaceholder.value = !value;
      }, () => store.commit('set_range'));

    });

    let showPlaceholder = ref(props.modelValue === defaultText || !props.modelValue);

    const saveRange = () => store.commit('set_range');

    const paste = (e: ClipboardEvent) => {
      onPaste(e, contentRef.value!, (value) => {
        store.commit('exec_command', { type: 'insertHTML', value })
      })
    }

    const onFocus = (e: FocusEvent) => { emit('focus', e); }

    const setValue = (val) => contentRef.value!.innerHTML = val;

    return { editableRef, contentRef, showPlaceholder, saveRange, paste, onFocus, setValue }
  }
}
</script>

<style lang="scss">
$--color-primary: #1AAFA7;

.cus__editable__item {
  position: relative;
  .cus__editable__content {
    padding: 10px 12px;
    border-radius: 4px;
    border: solid 1px #ccc;
    position: relative;
    outline: none;
    overflow: auto;
    &:focus {
      border-color: #1AAFA7;
    }
    &::after {
      content: '';
      display: flex;
      clear: both;
    }
    & > p:first-child {
      margin-top: 0;
    }
    & > p:last-child {
      margin-bottom: 0;
    }
  }
  .cus__editable__content,
  .cus__table__editable,
  .cus__table__resize__border {
    img {
      max-width: 100%;
      &::selection{
        background:0 0;
      }
    }
    i {
      font-style: italic;
    }
    table {
      thead td {
        background: #f1f1f1;
      }
      td, th {
        border: 1px solid #c7c7c7;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding: 0px 5px;
      }
      td[data-selected] {
        background: rgb(180, 215, 255);
      }
    }
    p {
      margin: 10px 0;
    }
    h1 {
      font-size: 2em;
    }
    font[size='1'] {
      font-size: 12px !important;
    }
    font[size='2'] {
      font-size: 14px !important;
    }
    font[size='3'] {
      font-size: 16px !important;
    }
    font[size='4'] {
      font-size: 18px !important;
    }
    font[size='5'] {
      font-size: 24px !important;
    }
    font[size='6'] {
      font-size: 32px !important;
    }
    font[size='7'] {
      font-size: 48px !important;
    }
    h2 {
      font-size: 1.5em;
    }
    h3 {
      font-size: 1.17em;
    }
    h4 {
      font-size: 1em;
    }
    h5 {
      font-size: .83em;
    }
  }
  .cus__editor__placeholder {
    color: #ccc;
    position: absolute;
    top: 11px;
    left: 13px;
    user-select: none;
    pointer-events: none;
    min-width: 100px;
  }
}
</style>
