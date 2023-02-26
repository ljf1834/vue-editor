import * as $ from '$';
import { getDomIndex, getInsertBeforeElement } from "./table";

/* ---------------- 合并单元格 ---------------- */
export const concatTableCell = (selectTds) => {
  let $base = selectTds[0];
  let baseLeft = $base.offsetLeft;
  let baseTop = $base.offsetTop;

  let span = selectTds.reduce((map, td) => {
    let { offsetLeft, offsetTop } = td;
    if (offsetLeft > baseLeft && offsetTop === baseTop) {
      map.colSpan += td.colSpan;
    }
    if (offsetTop > baseTop && offsetLeft === baseLeft) {
      map.rowSpan += td.rowSpan
    }
    return map;
  }, { rowSpan: $base.rowSpan, colSpan: $base.colSpan })

  $base.setAttribute('rowSpan', `${span.rowSpan}`);
  $base.setAttribute('colSpan', `${span.colSpan}`);

  selectTds.map((td, idx) => idx > 0 && td.remove());
}

/* ---------------- 拆分单元格 ---------------- */
export const splitTableCell = ($table, $td) => {
  let $trs = $table.querySelectorAll('tr');
  let rowIndex = getDomIndex($td.parentElement!);

  if ($td.colSpan > 1) {
    /* 当前行 */
    for (let col = 1; col < $td.colSpan; col++) {
      let tr = $trs[rowIndex];
      let insertBefore = getInsertBeforeElement(tr, $td);
      let el = $.element('td', {}, '&nbsp;')
      insertBefore ? tr.insertBefore(el, insertBefore) : tr.appendChild(el);
    }
    /* 下一行 */
    for (let col = 0; col < $td.colSpan; col++) {
      for (let row = 1; row < $td.rowSpan; row++) {
        let tr = $trs[rowIndex + row];
        let insertBefore = getInsertBeforeElement(tr, $td);
        let el = $.element('td', {}, '&nbsp;')
        insertBefore ? tr.insertBefore(el, insertBefore) : tr.appendChild(el);
      }
    }
  } else {
    for (let i = 1; i < $td.rowSpan; i++) {
      let tr = $trs[rowIndex + i];
      let insertBefore = getInsertBeforeElement(tr, $td);
      let el = $.element('td', {}, '&nbsp;')
      insertBefore ? tr.insertBefore(el, insertBefore) : tr.appendChild(el);
    }
  }
  $td.removeAttribute('colSpan');
  $td.removeAttribute('rowSpan');
}


export const addTableRow = ($table, $td) => {

}

export const addTableCol = ($table, $td) => {

}

export const removeTableRow = ($table, $td) => {

}
export const removeTableCol = ($table, $td) => {

}
