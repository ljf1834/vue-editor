import Vuex from 'vuex'
import { UploadRequestOptions } from "@/types"
import {
  execCommand as exec_command,
  setRange as set_range,
  restoreRange as restore_range,
  setToolbarInstance as set_toolbar_instance,
  removeToolbarInstance as remove_toolbar_instance,
} from './mutations'

interface State {
  currentRange: Range | null;
  showDropdown: boolean;
  currentType: string;
  currentId: string | null;
  toolbarInstance: Record<string, UploadRequestOptions>
}

const state = {
  currentRange: null,
  showDropdown: false,
  currentType: '',
  currentId: null,
  toolbarInstance: {}
}


const mutations = {
  set_current_id: (state, payload) => state.currentId = payload,
  set_range,
  exec_command,
  restore_range,
  set_toolbar_instance,
  remove_toolbar_instance,
  set_show_dropdown: (state, payload) => { state.showDropdown = payload; },
  set_current_type: (state, payload) => { state.currentType = payload; },
}

export default new Vuex.Store<State>({
  state,
  mutations
});
