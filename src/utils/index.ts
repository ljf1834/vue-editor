export { default as element } from './element'
export { default as debounce } from './debounce'
import { defaultText } from "./const"


export const setAutoSize = (autosize: number | { minRows: number, maxRows: number }, $editable: HTMLDivElement) => {
  if (typeof autosize === 'number') {
    $editable.style.minHeight = `${autosize * 21}px`;
  } else {
    autosize.minRows && ($editable.style.minHeight = `${autosize.minRows * 21}px`);
    autosize.maxRows && ($editable.style.maxHeight = `${autosize.maxRows * 21}px`);
  }
}

type TOnHtmlChange = ($editable: HTMLDivElement, callback: (value: string) => void, setRange: () => void) => void;
export const onHtmlChange: TOnHtmlChange = ($editable, callback, setRange) => {
  /* -------------  监听 编辑器内容 变更 ------------- */
  let observer = new MutationObserver(() => {
    let html = $editable.innerHTML;
    let isEmpty = !html || html === defaultText || html === '<br>';
    if (html.includes('cus__image__editable') || html.includes('cus__table__editable')) {
      let $dom = document.createElement('div');
      $dom.innerHTML = html;
      $dom.querySelector('.cus__image__editable')?.remove();
      $dom.querySelector('.cus__table__editable')?.remove();
      callback($dom.innerHTML);
    } else {
      callback(isEmpty ? '' : html);
    }
    if (isEmpty && html !== defaultText) {
      $editable.innerHTML = '';
      let $p = document.createElement('p');
      $p.innerHTML = '<br>';
      $editable.appendChild($p);

      const selection = window.getSelection()!;
      selection.removeAllRanges();
      const range = document.createRange();

      range.selectNodeContents($p)
      range.collapse(true);
      range.setStart($p, 0);
      range.setEnd($p, 0);
      selection.addRange(range);

      setRange();
    }
  });
  observer.observe($editable, {
    'childList': true,
    'attributes': true,
    'characterData': true,
    'subtree': true
  });
}

export class EditorError extends Error {
  constructor(m: string) {
    super(m)
    this.name = 'ElementPlusError'
  }
}


export function throwError(scope: string, m: string): never {
  throw new EditorError(`[${scope}] ${m}`)
}
