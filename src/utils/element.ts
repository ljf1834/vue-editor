
/**
 * @Method 创建Dom元素
 *
 * @param tagName: HTMLElementTagNameMap
 * @param options?: { attrs: object, className: string | string[], style: object, on: Object<EventListener> }
 * @param content?: string | HTMLElement
 */
interface IOptions {
  attrs?    : { [key: string]: string };
  className?: string | string[];
  style?    : { [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] };
  on?       : { [key: string]: Function };
}

const element = <K extends keyof HTMLElementTagNameMap, T extends Node>(tagName: K, options?: IOptions, content?: string | T | T[]): HTMLElementTagNameMap[K] => {
  let { attrs, className, style, on } = options || {};
  let element = document.createElement(tagName);
  attrs && Object.keys(attrs).map(key => element.setAttribute(key, attrs![key]));
  className && (typeof className === 'string' ? element.classList.add(className) : className.map(c => element.classList.add(c)));
  style && Object.keys(style).map(key => element.style[key] = style![key]);
  on && Object.keys(on).map(event => element[`on${event}`] = on![event]);
  if (!content) {
    return element;
  } else if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else if (Array.isArray(content)) {
    content.map(cont => element.appendChild(cont));
  } else if (typeof content === 'string') {
    element.innerHTML = content;
  }
  return element;
}
export {element as default}
