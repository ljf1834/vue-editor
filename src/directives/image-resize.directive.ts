import * as $ from '$';
import store from '../store';

export default {
  name: 'image-resize',
  mounted: (el) => new ImageEditable(el),
  unmounted: () => document.body.removeEventListener('click', documentClickHandle)
}

const isEditableContent = (node): boolean => {
  let editableClassName = 'cus__editable__content';
  while (node && node.tagName !== 'BODY' && !node.className.includes(editableClassName)) {
    node = node.parentElement;
  }
  return node ? node.className.includes(editableClassName) : false;
}

const documentClickHandle = ({ target }) => {
  if (!isEditableContent(target)) {
    document.querySelectorAll('.cus__image__editable').forEach($resize => $resize.remove());
  }
}

class ImageEditable {
  private $el!: HTMLElement;

  private $image!: HTMLImageElement;

  private $editable?: HTMLDivElement;

  constructor(el) {
    this.$el = el;
    this.$el.addEventListener('click', this.__click.bind(this));
    this.$el.addEventListener('keydown', () => this.$editable?.remove());

    document.body.addEventListener('click', documentClickHandle);
  }


  private __click({ target }) {
    this.$editable?.remove();
    if (target.tagName === 'IMG') {
      this.$image = target;
      __setRange(this.$image);

      this.$editable = this.__createResizeContainer(this.$image);
      this.$el.appendChild(this.$editable)
    }
  }

  private __createResizeContainer = (image: HTMLImageElement): HTMLDivElement => {

    let { offsetWidth, offsetHeight } = image;
    let { offsetTop, offsetLeft } = __getOffset(image);

    const resizeNodeStyle = { width: '10px', height: '10px', position: 'absolute', background: '#0f68e4', boxSizing: 'border-box', userSelect: 'none' }
    return $.element('div', {
      style: { width: '0', height: '0', position: 'absolute', top: `${offsetTop}px`, left: `${offsetLeft}px` },
      className: 'cus__image__editable'
    }, [
      ...Array.from(new Array(4), (_, idx) => $.element('div', {
        style: { ...resizeNodeStyle, ...calcPosition(offsetWidth, offsetHeight, idx) },
        className: 'cus__image__resize__node',
        on: this.__dragEvents(idx)
      })),
      $.element('div', {
        style: { width: `${offsetWidth}px`, height: `${offsetHeight}px`, pointerEvents: 'none', outline: '3px solid #b4d7ff' },
        className: 'cus__image__resize__border',
      }),
      $.element('img', {
        style: { width: `${offsetWidth}px`, maxWidth: 'initial', height: `${offsetHeight}px`, opacity: '0', border: 'dashed 1px #999', pointerEvents: 'none', position: 'absolute', top: '0', left: '0' },
        attrs: { src: image.src }
      })
    ])
  }

  private __dragEvents = (idx: number) => {
    return {
      mousedown: (event: MouseEvent) => {
        event.stopPropagation();
        event.preventDefault();

        let { clientX, clientY } = event;

        let $preview = this.$editable!.querySelector('img')!;
        $preview.style.opacity = '.5';

        let { offsetWidth, offsetHeight, offsetLeft, offsetTop } = $preview;
        let ratio = offsetWidth / offsetHeight;

        document.onmousemove = (e: MouseEvent) => {

          let x = e.clientX - clientX;
          let y = e.clientY - clientY;
          let xGy = Math.abs(x) > Math.abs(y) * ratio;
          if (idx === 0) {
            /* 根据宽高比 计算拖动大小 */
            let moveX = xGy ? x : y * ratio;
            let moveY = xGy ? x / ratio : y;

            $preview.style.width = `${offsetWidth - moveX}px`;
            $preview.style.height = `${offsetHeight - moveY}px`;
            $preview.style.left = `${offsetLeft + moveX}px`;
            $preview.style.top = `${offsetTop + moveY}px`;
          } else if (idx === 1) {
            /* 根据宽高比 计算拖动大小 */
            let moveX = xGy ? x : -(y * ratio);
            let moveY = xGy ? x / ratio : -y;

            $preview.style.width = `${offsetWidth + moveX}px`;
            $preview.style.height = `${offsetHeight + moveY}px`;
            $preview.style.top = `${offsetTop - moveY}px`;
          } else if (idx === 2) {
            let moveX = xGy ? -x : y * ratio;
            let moveY = xGy ? -x / ratio : y;

            $preview.style.width = `${offsetWidth + moveX}px`;
            $preview.style.height = `${offsetHeight + moveY}px`;
            $preview.style.left = `${offsetLeft - moveX}px`;
          } else {
            let moveX = xGy ? x : y * ratio;
            let moveY = xGy ? x / ratio : y;

            $preview.style.width = `${offsetWidth + moveX}px`;
            $preview.style.height = `${offsetHeight + moveY}px`;
          }
        }
        document.onmouseup = (e: MouseEvent) => {
          let { offsetWidth, offsetHeight } = $preview;
          /* --------- 修改图片大小 --------- */
          let maxWidth = __getMaxWidth(this.$image);
          this.$image.style.width = `${offsetWidth > maxWidth ? maxWidth : offsetWidth}px`;
          this.$image.style.height = offsetHeight > maxWidth / ratio ? `${maxWidth / ratio}px` : `${offsetHeight}px`;

          /* --------- 重绘 resize --------- */
          this.$editable?.remove();
          this.$editable = this.__createResizeContainer(this.$image);
          this.$el.appendChild(this.$editable);

          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    }
  }
}


export const calcPosition = (width, height, idx) => {
  if (idx === 0) {
    return {
      top: `0`,
      left: `0`,
      transform: 'translate3d(-50%, -50%, 0)',
      cursor: 'nw-resize'
    }
  } else if (idx === 1) {
    return {
      top: `0`,
      left: `${width}px`,
      transform: 'translate3d(-50%, -50%, 0)',
      cursor: 'ne-resize'
    }
  } else if (idx === 2) {
    return {
      top: `${height}px`,
      left: `0`,
      transform: 'translate3d(-50%, -50%, 0)',
      cursor: 'sw-resize'
    }
  } else {
    return {
      top: `${height}px`,
      left: `${width}px`,
      transform: 'translate3d(-50%, -50%, 0)',
      cursor: 'se-resize'
    }
  }
}

/* ------------ 设置 range 选区 为图片 ------------ */
const __setRange = (image: HTMLImageElement) => {
  let $parent = image.parentElement!
  Array.from($parent.childNodes).map((node, idx) => {
    if (node === image) {
      const selection = window.getSelection()!;
      selection.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents($parent)
      range.collapse(false);
      range.setStart($parent, idx);
      range.setEnd($parent, idx + 1);
      selection.addRange(range);
      store.commit('set_range');
    }
  })
}

const __getOffset = (image: HTMLImageElement) => {
  let $parent = __getParentTd(image);
  let $dom = image;

  if ($parent.tagName === 'TD') {
    let $table = __getTable($parent)
    return { offsetTop: $parent.offsetTop + $table.offsetTop + image.offsetTop + 3, offsetLeft: $parent.offsetLeft + $table.offsetLeft + image.offsetLeft + 3 }
  }

  return { offsetTop: $dom.offsetTop, offsetLeft: $dom.offsetLeft }
}

/* ------------ 获取图片最大宽度 ------------ */
const __getMaxWidth = (image: HTMLImageElement) => {
  image.style.width = '99999px';
  let maxWidth = image.offsetWidth;
  return maxWidth;
}


const __getParentTd = (node): HTMLElement => {
  while (node.tagName !== 'TD' && node.tagName !== 'TH' && !node.className.includes('cus__editable__content')) {
    node = node.parentElement;
  }
  return node;
}
const __getTable = (node): HTMLTableElement => {
  while (node.tagName !== 'TABLE' && !node.className.includes('cus__editable__content')) {
    node = node.parentElement;
  }
  return node;
}
