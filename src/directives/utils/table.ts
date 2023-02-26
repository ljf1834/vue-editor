import * as $ from '$';

export const createActionList = (actionList, height) => $.element('div', {
  style: {
    display: 'flex',
    color: '#f1f1f1',
    fontSize: '12px',
    padding: '4px 3px 6px 8px',
    borderRadius: '4px',
    background: 'rgba(0, 0, 0, .75)',
    whiteSpace: 'nowrap',
    position: 'absolute',
    top: `${height + 10}px`,
    left: `0`,
    zIndex: '11'
  }
}, actionList.map(({ click, text }) => $.element('div', {
  style: { marginRight: '5px', cursor: 'pointer' }, on: { mousedown: e => e.stopPropagation(), click }
}, text)))

export const createTr = (tr) => {
  return $.element('div', {
    style: {
      width: `${tr.offsetWidth}px`,
      height: '3px',
      background: 'rgba(180, 215, 255, .3)',
      position: 'absolute',
      top: `${tr.offsetTop + tr.offsetHeight}px`,
      left: `0`,
      opacity: '0',
      cursor: 'row-resize'
    },
    on: {
      mousedown: function (event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        // @ts-ignore
        this.style.opacity = '1';

        let { clientY } = event;
        // @ts-ignore
        let top = parseFloat(this.style.top);

        document.onmousemove = (e: MouseEvent) => {
          // @ts-ignore
          this.style.top = `${top + e.clientY - clientY}px`;
        }
        document.onmouseup = (e: MouseEvent) => {
          // @ts-ignore
          let move = parseFloat(this.style.top) - top;
          tr.style.height = `${tr.offsetHeight + move}px`;
          // @ts-ignore
          this.style.opacity = '0';

          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  })
}

export const createTd = (td, height) => $.element('div', {
  style: {
    width: '3px',
    height: `${height}px`,
    background: 'rgba(180, 215, 255, .3)',
    position: 'absolute',
    top: `0`,
    left: `${td.offsetLeft + td.offsetWidth}px`,
    opacity: '0',
    cursor: 'col-resize'
  },
  on: {
    mousedown: function (event: MouseEvent) {
      event.stopPropagation();
      event.preventDefault();
      // @ts-ignore
      this.style.opacity = '1';

      let { clientX } = event;
      // @ts-ignore
      let left = parseFloat(this.style.left);

      document.onmousemove = (e: MouseEvent) => {
        // @ts-ignore
        this.style.left = `${left + e.clientX - clientX}px`;
      }
      document.onmouseup = (e: MouseEvent) => {
        // @ts-ignore
        // let move = parseFloat(this.style.left) - left;
        // td.style.width = `${td.offsetWidth + move}px`;
        // @ts-ignore
        this.style.opacity = '0';

        document.onmousemove = null;
        document.onmouseup = null;
      }
    }
  }
})



export const getMinSize = (table: HTMLTableElement) => {
  let $table = $.element('div', { style: { position: 'absolute', opacity: '0' } });
  $table.innerHTML = table.outerHTML;
  let dom = $table.querySelector('table')!;
  dom.style.width = '0';
  dom.style.height = '0';
  document.body.appendChild($table);
  let size = { minWidth: dom.offsetWidth, minHeight: dom.offsetHeight };
  $table.remove();
  return size
}


export const getTable = (node): HTMLTableElement | null => {
  while (node && node.tagName !== 'TABLE' && !node.className.includes('cus__editable__content')) {
    node = node.parentNode;
  }
  return node && node.tagName === 'TABLE' ? node : null;
}


export const getDom = (node, tagName: string): HTMLElement | null => {
  while (node && node.tagName !== tagName && !node.className?.includes('cus__editable__content')) {
    node = node.parentElement;
  }
  return node && node.tagName === tagName ? node : null;
}


export const getDomIndex = (el: HTMLElement): number => {
  let $parent = el.parentElement!;
  for (let i = 0; i < $parent.children.length; i++) {
    if ($parent.children[i] === el) {
      return i;
    }
  }
  return 0;
}


export const getInsertBeforeElement = (tr, baseTd): HTMLElement | null => {
  let { offsetLeft, offsetWidth } = baseTd;
  let index = -1;
  for (let i = 0; i < tr.children.length; i++) {
    let td = tr.children[i];
    if (td.offsetLeft >= offsetLeft + offsetWidth) {
      index = i;
      break;
    }
  }
  return index === -1 ? null : tr.children[index];
}
