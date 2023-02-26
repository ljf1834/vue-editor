export const defaultText = '<p><br></p>';



// const base64ToUrl = async (image, container) => {
//   let src = image.getAttribute('src')!;
//   if (src.substr(0, 5) === 'data:') {
//     let { width, height, offsetTop, offsetLeft } = image;
//     let loading = document.createElement('div');
//     loading.contentEditable = 'false';
//     Object.entries(getLoadingStyle(width, height, offsetTop, offsetLeft)).map(style => loading.style[style[0]] = style[1]);
//     loading.innerHTML = `<i class="el-icon-loading" style="font-size: 40px;" />`;
//     container.appendChild(loading);

//     let blob = dataURLToBlob(src);
//     let file = blobToFile(blob, 'homework.png', 'image/png');

//     const formData = new FormData();
//     formData.append('file', file);
//     let res = await axios.post<null, any>('/system/file/uploadFile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
//     image.setAttribute('src', `${import.meta.env.VITE_APP_BASE_URL}${res.json.filePath}`);
//     loading.remove();
//   }
// }


// const dataURLToBlob = (dataurl: string): Blob => {
//   var arr = dataurl.split(','),
//     mime = arr[0].match(/:(.*?);/)![1],
//     bstr = atob(arr[1]),
//     n = bstr.length,
//     u8arr = new Uint8Array(n);
//   while (n--) { u8arr[n] = bstr.charCodeAt(n); }
//   return new Blob([u8arr], { type: mime });
// }

// const blobToFile = (blob: Blob, fileName: string, mime: string): File => {
//   const files = new window.File(
//     [blob],
//     fileName,
//     { type: mime }
//   );
//   return files;
// }
