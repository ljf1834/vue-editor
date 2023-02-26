import Editor from '@/components/editor.vue'
import EditorToolbar from '@/components/toolbar.vue'
import EditorItem from '@/components/item.vue'

export default function (Vue) {
  Vue.component('Editor', Editor);
  Vue.component('EditorToolbar', EditorToolbar);
  Vue.component('EditorItem', EditorItem);
}

export { Editor, EditorToolbar, EditorItem }

