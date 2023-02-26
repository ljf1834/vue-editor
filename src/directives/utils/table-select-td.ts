import * as $ from '$';
import { getTable } from './table';


export default class TableSelectTd {
  private $el!: HTMLElement;

  private fn!: (value: HTMLTableCellElement[]) => void;
  constructor($el, callback) {
    this.$el = $el;
    this.fn = callback;

    this.$el.addEventListener('mousedown', this.__mousedown);
    this.$el.addEventListener('mousemove', $.debounce(this.__mousemove, 50));
    this.$el.addEventListener('mouseup', this.__mouseup);
  }


  private $downElement: HTMLTableCellElement | null = null;
  private $table!: HTMLTableElement;
  private $vNode: Array<HTMLTableCellElement[]> = [];

  private selectedList: HTMLTableCellElement[] = []

  private __mousedown = ({ target }) => {
    clearSelectTd();
    this.selectedList = [];
    if (target.tagName === 'TD') {
      this.$downElement = target;

      this.$table = getTable(target)!;
      this.$vNode = createVNode(this.$table);

    } else {
      this.$downElement = null
    }
  }
  private $moveElement: HTMLTableCellElement | null = null;
  private __mousemove = ({ target }) => {
    if (this.$downElement && target !== this.$downElement && target.tagName === 'TD') {
      this.$moveElement = target;
      getSelectPoint(this.$vNode, this.$downElement, this.$moveElement!, (list) => {
        this.selectedList = list;
      });


    } else {
      this.$moveElement = null;
      this.selectedList = [];
      this.$downElement && clearSelectTd();
    }
  }
  private __mouseup = ({ target }) => {
    if (getTable(target)) {
      this.fn(target === this.$downElement ? [target] : this.selectedList);
    }
    this.$downElement = this.$moveElement = null;
  }
}


const clearSelectTd = () => {
  document.querySelectorAll('*[data-selected]').forEach(dom => dom.removeAttribute('data-selected'))
}


const createVNode = ($table: HTMLTableElement): Array<HTMLTableCellElement[]> => {
  let $vNode: Array<HTMLTableCellElement[]> = [];
  let $trs = Array.from($table.querySelectorAll('tr'))
  $trs.map((tr, idx) => {
    let $tds = Array.from(tr.querySelectorAll('td'));
    $vNode[idx] = $tds;
  })

  return $vNode;
}

/* -------------- 获取选择的td -------------- */
const getSelectPoint = (vnode, $start, $end, fn) => {

  let sW = $start.offsetWidth, sH = $start.offsetHeight, sT = $start.offsetTop, sL = $start.offsetLeft;
  let eW = $end.offsetWidth, eH = $end.offsetHeight, eT = $end.offsetTop, eL = $end.offsetLeft;
  let startX = sL >= eL ? sL + sW : sL;
  let startY = sT >= eT ? sT + sH : sT;
  let endX = sL >= eL ? eL : eL + eW;
  let endY = sT >=eT ? eT : eH + eT;

  if (startX > endX) { [startX, endX] = [endX, startX] }
  if (startY > endY) { [startY, endY] = [endY, startY] }

  collision(vnode, startX, startY, endX, endY, (sx, sy, ex, ey) => {
    startX = sx;
    startY = sy;
    endX = ex;
    endY = ey;
  });

  clearSelectTd();
  let selectTds: HTMLTableCellElement[] = [];
  vnode.map(tr => {
    tr.map(td => {
      let sx = td.offsetLeft;
      let sy = td.offsetTop;
      let ex = td.offsetLeft + td.offsetWidth;
      let ey = td.offsetTop + td.offsetHeight;

      if (sx >= startX && sy >= startY && ex <= endX && ey <= endY) {
        selectTds.push(td);
      }
    });
  })
  selectTds.map(td => td.setAttribute('data-selected', 'true'));
  fn(selectTds);
}

/* -------------- 位置碰撞计算 -------------- */
const collision = (vnode, sx, sy, ex, ey, fn) => {
  let isReset = false;
  let nsx = sx, nsy = sy, nex = ex, ney = ey;

  vnode.map(tr => {
    tr.map(td => {
      let tdSx = td.offsetLeft;
      let tdSy = td.offsetTop;
      let tdEx = td.offsetLeft + td.offsetWidth;
      let tdEy = td.offsetTop + td.offsetHeight;
      if (tdSx < nex && tdSy < ney && tdEx > nex) {     // 触碰到右侧
        isReset = true;
        nex = tdEx;
      } else if (tdEx > nsx && tdEy > nsy && tdSx < nsx) {     // 触碰到左侧
        isReset = true;
        nsx = tdSx;
      } else if (tdEy > nsy && tdEx > nsx && tdSy < nsy && tdEx < nex) {     // 触碰到底部
        isReset = true;
        nsy = tdSy;
      } else if (tdSx < nex && tdSy < ney && tdEy > ney) {     // 触碰到顶部
        isReset = true;
        ney = tdEy;
      }
    })
  });
  isReset ? collision(vnode, nsx, nsy, nex, ney, fn) : fn(nsx, nsy, nex, ney);
}
