<template>
  <div :class="['cus__editable__contaienr', uuid,  { 'is__affix': affix, 'is__focus': currentId === uuid }]"
       @click.stop="onClick">
    <div :class="['cus__editable__toolbar']" v-show="affix ? currentId === uuid : true">
      <editor-toolbar :uploadOptions="$props.uploadOptions"/>
    </div>
    <editor-item
        :placeholder="placeholder"
        :modelValue="model"
        @update:modelValue="onUpdate"
        :autosize="autosize"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
    />
  </div>
</template>

<script lang="ts">
import {ref, onUnmounted, PropType, onMounted, computed, provide} from 'vue';
import store from '@/store';
import editorToolbar from '@/components/toolbar.vue'
import editorItem from '@/components/item.vue'
import { UploadRequestOptions } from '@/types';

export default {
  name: 'editor',
  props: {
    placeholder: {
      type: String,
      default: '请输入正文'
    },
    modelValue: {
      type: String,
      default: ''
    },
    affix: {
      type: Boolean,
      default: false
    },
    autosize: {
      type: [Number, Object] as PropType<{ minRows: number, maxRows: number } | number>,
      default: 4
    },
    uploadOptions: {
      type: Object as PropType<UploadRequestOptions>,
      default: () => ({
        action: '',
        headers: {},
        method: 'post',
        data: {},
        name: 'file',
        withCredentials: false,
        onSuccess: null,
        onError: null,
        onProgress: null
      })
    }
  },
  components: {
    editorToolbar,
    editorItem
  },
  setup(props, {emit}) {

    let currentId = computed(() => store.state.currentId);

    let uuid = `cus__editable--${`${Math.random()}`.substr(2)}`;

    provide('uuid', uuid);

    let model = ref(props.modelValue || '<p><br></p>');

    let onUpdate = (value: string) => {
      model.value = value;
      emit('update:modelValue', value);
    }

    const onClick = (event) => {
      store.commit('set_current_id', !!__getEditableDom(event.target, uuid) ? uuid : null);
    }
    const __bodyClick = () => store.commit('set_current_id', null);

    onMounted(() => {
      document.body.addEventListener('click', __bodyClick);
    });
    onUnmounted(() => {
      document.body.removeEventListener('click', __bodyClick);
    });


    return {currentId, uuid, model, onUpdate, onClick}
  }
}


const __getEditableDom = (element, uuid): boolean => {
  while (element && element.tagName !== 'BODY' && !element.className.includes(uuid)) {
    element = element.parentElement;
  }
  return element === null || element.tagName !== 'BODY';
}
</script>

<style lang="scss">
$--color-primary: #1AAFA7;

.cus__editable__contaienr {
  border: solid 1px #ccc;
  border-radius: 4px;
  flex: 1;
  position: relative;

  &.is__focus {
    border-color: $--color-primary;

    .cus__editable__toolbar {
      border-color: $--color-primary;
    }
  }

  &.is__affix {
    .cus__editable__toolbar {
      margin-top: -1px;
      box-shadow: 0 0 10px #ccc;
      position: absolute;
      top: 0;
      left: 0;
      transform: translate3d(0, -100%, 0);
      border-bottom: 0;
      z-index: 9;
    }
  }

  .cus__editable__toolbar {
    border-bottom: solid 1px #ccc;
  }

  .cus__editable__item .cus__editable__content {
    border: 0;
  }
}
</style>
