import ajax from "$/ajax";
import { TMenuType } from "$/toolbar";

export const execCommand = (state, { type, value }: { type: TMenuType, value?: any }) => {
  restoreRange(state);
  if (type === 'lineHeight') {
    __setStyle(state.currentRange, type, value)
  } else if (['alignLeft', 'alignCenter', 'alignRight', 'alignJustify'].includes(type)) {
    __setAlign(state.currentRange, type.substring(5).toLocaleLowerCase())
  } else if (type === 'link') {
    __createLink(state.currentRange, value);
  } else if (type === 'table') {
    __createTable(state.currentRange, value);
  } else if (type === 'image') {
    __createImage(state, value);
  } else if (type === 'text-indent') {
    let el = __getCurrentBlockParent(state.currentRange.commonAncestorContainer);
    let { collapsed, startContainer, endContainer } = state.currentRange;
    if (collapsed || startContainer === endContainer) {
      let indent = el?.style.textIndent;
      el.style.textIndent = indent ? '' : '2em';
    } else {
      let startIndex = __getDomIndex(__getCurrentBlockParent(startContainer));
      let endIndex = __getDomIndex(__getCurrentBlockParent(endContainer));
      for (let i = startIndex; i <= endIndex; i++) {
        let indent = el.children[i].style.textIndent;
        el.children[i].style.textIndent = indent ? '' : '2em';
      }
    }
  } else {
    document.execCommand(type, false, value);
  }
  setRange(state);

  state.showDropdown = false;
}
export const setRange = (state) => {
  const selection = window.getSelection()!;
  let range = selection.getRangeAt(0);
  state.currentRange = range;
  state.showDropdown = false;
}
export const restoreRange = (state) => {
  if (state.currentRange) {
    const selection = window.getSelection()!;
    selection.removeAllRanges();
    let range = document.createRange();
    let currentRange = state.currentRange;
    range.setStart(currentRange.startContainer, currentRange.startOffset);
    range.setEnd(currentRange.endContainer, currentRange.endOffset);
    selection.addRange(range);
  }
}
export const setToolbarInstance = (state, {instanceKey, uploadOptions}) => state.toolbarInstance[instanceKey] = uploadOptions;
export const removeToolbarInstance = (state, instanceKey) => delete state.toolbarInstance[instanceKey];
export const setActiveToolbarInstanceKey = (state, instanceKey) => state.activeToolbarInstanceKey = instanceKey;

//utils
const __createLink = (range, { url, text }) => {
  if (range.collapsed) {
    let node = range.startContainer.nodeName === '#text' ? range.startContainer.parentNode : range.startContainer;
    let $a = `<a href="${ url }">${ text }</a>`;
    node.innerHTML = `${node.innerHTML.slice(0, range.startOffset)}${$a}${node.innerHTML.slice(range.startOffset)}`
  } else {
    document.execCommand('createLink', false, url);
  }
}
const __createTable = (range, { row, col }) => {
  let $td = Array.from(Array(col), () => `<td style="width: ${1 / col * 100}%"><br></td>`).join('');
  let $tr = Array.from(Array(row), () => `<tr>${ $td }</tr>`).join('');
  let $table = `<table style="width: 100%;border-collapse: collapse;"><tbody>${ $tr }</tbody></table>`;
  document.execCommand('insertHTML', false, $table);
}
const __createImage = async (state, file) => {
  const _onSuccess = state.toolbarInstance[state.activeToolbarInstanceKey].onSuccess;
  ajax({
    ...state.toolbarInstance[state.activeToolbarInstanceKey],
    file: file,
    onSuccess: (res) => {
      document.execCommand('insertImage', false, res.data.url)
      _onSuccess(res)
    }
  })
}
const __setAlign = (range, value) => {
  if (range.startContainer === range.endContainer && Math.abs(range.endOffset - range.startOffset) === 1 && range.commonAncestorContainer.childNodes[range.startOffset].tagName === 'IMG') {
    if (value === 'justify') { return; }
    if (value === 'center') {
      __getCurrentBlockParent(range.commonAncestorContainer.childNodes[range.startOffset]).style.textAlign = 'center';
      range.commonAncestorContainer.childNodes[range.startOffset].style.float = 'none';
    } else {
      range.commonAncestorContainer.childNodes[range.startOffset].style.float = value;
    }
  } else {
    __setStyle(range, 'textAlign', value)
  }
  document.body.querySelector('.cus__image__editable')?.remove();
}
const __setStyle = (range, style, value) => {
  let { startContainer, endContainer } = range;
  __getCurrentBlockParent(startContainer).style[style] = value;
  __getCurrentBlockParent(endContainer).style[style] = value;
}
const __getCurrentBlockParent = (node) => {
  while (node.tagName !== 'P' && node.tagName !== 'TABLE' && node.tagName !== 'TD' && node.tagName !== 'DIV') {
    node = node.parentNode;
  }
  return node;
}
const __getDomIndex = (el: HTMLElement): number => {
  let $parent = el.parentElement!;
  for (let i = 0; i < $parent.children.length; i++) {
    if ($parent.children[i] === el) {
      return i;
    }
  }
  return 0;
}
