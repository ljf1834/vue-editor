import * as $ from '$';
import store from '../store';

import { calcPosition } from './image-resize.directive';

import { getMinSize, getTable, createActionList, createTr, createTd, getDom } from './utils/table';
import { concatTableCell, splitTableCell, addTableRow, addTableCol, removeTableRow, removeTableCol } from './utils/table-actions';

import TableSelectTd from './utils/table-select-td';


const isEditableContent = (node): boolean => {
  let editableClassName = 'cus__editable__content';
  while (node && node.tagName !== 'BODY' && !node.className.includes(editableClassName)) {
    node = node.parentElement;
  }
  return node ? node.className.includes(editableClassName) : false;
}

const documentClickHandle = ({ target }) => {
  if (!isEditableContent(target)) {
    document.querySelectorAll('.cus__table__editable').forEach($resize => $resize.remove());
  }
}
class TableEditable {
  private $el!: HTMLElement;

  private $table!: HTMLTableElement;

  private $editable?: HTMLElement;

  private selectTds: HTMLTableCellElement[] = [];

  constructor(el) {
    this.$el = el;

    this.$el.addEventListener('click', this.__click);

    this.$el.addEventListener('keydown', () => this.$editable?.remove() );

    document.body.addEventListener('click', documentClickHandle);

    new TableSelectTd(this.$el, (tds) => this.selectTds = tds)
  }


  private __click = ({ target }) => {
    this.$editable?.remove();
    if (target.tagName === 'IMG') { return; }
    let $table = getTable(target);
    if ($table) {
      this.$table = $table;

      this.$editable = this.__createResizeContainer(this.$table);
      this.$el.appendChild(this.$editable)
    }
  }

  private __createResizeContainer = ($table: HTMLTableElement) => {
    let { offsetWidth, offsetHeight, offsetTop, offsetLeft } = $table;

    /* ----------- 蓝色边框 ----------- */
    let resizeBorder = $.element('div', {
      style: { width: `${offsetWidth}px`, height: `${offsetHeight}px`, pointerEvents: 'none', border: '3px solid #b4d7ff' },
      className: 'cus__table__resize__border',
    });

    /* ----------- 四个角的拖拽点 ----------- */
    const resizeNodeStyle = { width: '10px', height: '10px', position: 'absolute', background: '#0f68e4', boxSizing: 'border-box', userSelect: 'none' }
    let resizeNodes = Array.from(new Array(4), (_, idx) => $.element('div', {
      style: { ...resizeNodeStyle, ...calcPosition(offsetWidth, offsetHeight, idx) },
      className: 'cus__table__resize__node',
      on: this.__dragEvents(idx)
    }));

    /* --------- 生成 边框及tr、td 拖动线 --------- */
    let $trList = Array.from($table.querySelectorAll('tr')) as HTMLTableRowElement[];
    let $trs = $trList.map(tr => createTr(tr));
    let $tds = $trList.reduce<HTMLTableCellElement[]>((tds, tr) => tds.length > tr.querySelectorAll('td').length ? tds : Array.from(tr.querySelectorAll('td')), []).map(td => createTd(td, offsetHeight));

    let $actions = createActionList(this.tableActionList, offsetHeight)

    let $editable = $.element('div', {
      className: 'cus__table__editable',
      style: { width: '0', height: '0', position: 'absolute', top: `${offsetTop}px`, left: `${offsetLeft}px`, userSelect: 'none' }
    }, [resizeBorder, $actions, ...$trs, ...$tds, ...resizeNodes]);

    return $editable;
  }


  private __dragEvents = (idx: number) => {
    return {
      mousedown: (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        let { clientX, clientY } = event;

        let { minWidth, minHeight } = getMinSize(this.$table);

        let { offsetWidth, offsetHeight } = this.$table;
        let $preview = $.element('div', { style: { width: `${offsetWidth}px`, height: `${offsetHeight}px`, opacity: '.5', border: 'dashed 1px #999', pointerEvents: 'none', position: 'absolute', top: '0', left: '0' } })
        $preview.innerHTML = this.$table.outerHTML;
        $preview.querySelector('table')!.style.width = '100%';
        $preview.querySelector('table')!.style.height = '100%';
        this.$editable?.appendChild($preview);

        document.onmousemove = (e: MouseEvent) => {

          let x = e.clientX - clientX;
          let y = e.clientY - clientY;

          if (idx === 0) {
            $preview.style.width = `${offsetWidth - x > minWidth ? offsetWidth - x : minWidth}px`;
            $preview.style.height = `${offsetHeight - y > minHeight ? offsetHeight - y : minHeight}px`;
            $preview.style.left = `${x > offsetWidth - minWidth ? offsetWidth - minWidth : x}px`;
            $preview.style.top = `${y > offsetHeight - minHeight ? offsetHeight - minHeight : y}px`;
          } else if (idx === 1) {
            $preview.style.width = `${offsetWidth + x > minWidth ? offsetWidth + x : minWidth}px`;
            $preview.style.height = `${offsetHeight - y > minHeight ? offsetHeight - y : minHeight}px`;
            $preview.style.top = `${y > offsetHeight - minHeight ? offsetHeight - minHeight : y}px`;
          } else if (idx === 2) {
            $preview.style.width = `${offsetWidth - x > minWidth ? offsetWidth - x : minWidth}px`;
            $preview.style.height = `${offsetHeight + y > minHeight ? offsetHeight + y : minHeight}px`;
            $preview.style.left = `${x > offsetWidth - minWidth ? offsetWidth - minWidth : x}px`;
          } else {
            $preview.style.width = `${offsetWidth + x > minWidth ? offsetWidth + x : minWidth}px`;
            $preview.style.height = `${offsetHeight + y > minHeight ? offsetHeight + y : minHeight}px`;
          }
        }
        document.onmouseup = (e: MouseEvent) => {
          this.$table.style.width = `${$preview.offsetWidth}px`;
          this.$table.style.height = `${$preview.offsetHeight}px`;

          // /* --------- 重绘 resize --------- */
          this.$editable?.remove();
          this.$editable = this.__createResizeContainer(this.$table);
          this.$el.appendChild(this.$editable);

          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  }

  private tableActionList = [
    {
      text: '删除表格',
      click: () => this.$table.parentElement?.tagName === 'P' ? this.$table.parentElement.remove() : this.$table.remove()
    },
    {
      text: '添加行',
      click: () => {
        let $td = getDom(store.state.currentRange?.endContainer, 'TD');
        addTableRow(this.$table, $td);
      }
    },
    {
      text: '添加列',
      click: () => {
        let $td = getDom(store.state.currentRange?.endContainer, 'TD');
        addTableCol(this.$table, $td);
      }
    },
    {
      text: '删除行',
      click: () => {
        let $td = getDom(store.state.currentRange?.endContainer, 'TD');
        removeTableRow(this.$table, $td);
      }
    },
    {
      text: '删除列',
      click: () => {
        let $td = getDom(store.state.currentRange?.endContainer, 'TD');
        removeTableCol(this.$table, $td);
      }
    },
    {
      text: '合并单元格',
      click: () => this.selectTds.length > 1 && concatTableCell(this.selectTds)
    },
    {
      text: '拆分单元格',
      click: () => {
        let $td = this.selectTds[0];
        $td && this.selectTds.length === 1 && splitTableCell(this.$table, $td);
      }
    }
  ]
}



export default {
  name: 'table-resize',
  mounted: (el) => new TableEditable(el),
  unmounted: () => document.body.removeEventListener('click', documentClickHandle)
}
