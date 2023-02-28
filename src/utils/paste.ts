import ajax from '$/ajax'
import store from '@/store'

export const onPaste = (e: ClipboardEvent, $editable, execCommand) => {
  const html = e.clipboardData!.getData('text/html');
  const $doc = new DOMParser().parseFromString(html, 'text/html');
  if ($doc.body.innerHTML) {
    $doc.querySelectorAll('img').forEach(img => img.src.startsWith('file://') && img.remove());
    $doc.body.querySelectorAll('*').forEach(dom => __clearStyle(dom as HTMLElement));
    execCommand($doc.body.innerHTML.replace(genRemoveInilineDomReg(), ''));
    e.preventDefault();
  }

  setTimeout(() => {
    const images = $editable.querySelectorAll('img');
    images.forEach(img => __base64ToUrl(img, $editable));
  });
}


const __retainStyle = (dom: HTMLElement): { [key: string]: string } => {
  let retainStyle: { [key: string]: string } = {};

  if (dom.style.color) { retainStyle.color = dom.style.color; }

  if (dom.style.background) { retainStyle.background = dom.style.background; }

  if (dom.style.backgroundColor) { retainStyle.backgroundColor = dom.style.backgroundColor; }

  if (dom.style.width) { retainStyle.width = dom.style.width; }

  if (dom.style.height) { retainStyle.height = dom.style.height; }

  return retainStyle;
}
const __clearStyle = (dom: HTMLElement) => {
  dom.removeAttribute('style');
  dom.removeAttribute('class');
  dom.removeAttribute('align');
  if (dom.tagName === 'TABLE') {
    dom.removeAttribute('border');
    dom.setAttribute('style', 'border-collapse: collapse;')
  } else if (dom.tagName === 'TD') {
    dom.removeAttribute('width');
  }
}

const __getLoadingStyle = (width, height, top, left) => {
  let styles = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'absolute',
    top: `${top}px`,
    left: `${left}px`,
    background: '#fff',
    textAlign: 'center',
    lineHeight: `${height}px`,
    boxSizing: 'border-box',
    border: 'solid 1px #eee',
    borderRadius: '2px'
  }
  return styles
}

const __base64ToUrl = async (image, container) => {
  let src = image.getAttribute('src')!;
  if (src.substr(0, 5) === 'data:') {
    let { width, height, offsetTop, offsetLeft } = image;
    let loading = document.createElement('div');
    loading.contentEditable = 'false';
    Object.entries(__getLoadingStyle(width, height, offsetTop, offsetLeft)).map(style => loading.style[style[0]] = style[1]);
    loading.innerHTML = `<i class="el-icon-loading" style="font-size: 40px;" />`;
    container.appendChild(loading);

    let blob = __dataURLToBlob(src);
    let file = __blobToFile(blob, 'homework.png', 'image/png');
    ajax({
      data: {},
      action: store.state.toolbarInstance[store.state.activeToolbarInstanceKey ?? Object.keys(store.state.toolbarInstance)[0]].action,
      file,
      filename: file.name,
      method: 'post',
      headers: {},
      withCredentials: true,
      onProgress: (e) => {},
      onError:(e) => {},
      onSuccess: (res) => {
        image.setAttribute('src', `${new URL('https://xiaohe.edu/system/file/uploadFile').origin}${res.json.filePath}`);
        loading.remove();
      }
    })
  }
}


const __dataURLToBlob = (dataurl: string): Blob => {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
  return new Blob([u8arr], { type: mime });
}

const __blobToFile = (blob: Blob, fileName: string, mime: string): File => {
  const files = new window.File(
    [blob],
    fileName,
    { type: mime }
  );
  return files;
}


const genRemoveInilineDomReg = () => {
  let labels = ['a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'cite', 'code', 'dfn', 'em', 'font', 'i', 'kbd', 'label', 'q', 's', 'samp', 'select', 'small', 'span', 'strike', 'strong', 'sub', 'sup', 'tt', 'u'];
  return new RegExp(`<(?!img|${labels.map(l => `${l}|\/${l}`)}).*?>`, 'g')
}

