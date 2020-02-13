declare type HTMLElementMap = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
interface NormalObject {
    [key: string]: any;
}
declare class DOMUtils<K extends HTMLElementMap> {
    private element;
    constructor(element: K);
    get className(): string;
    get classList(): string[];
    hasClass(className: string): boolean;
    addClass(className: string): DOMUtils<K>;
    removeClass(className: string): DOMUtils<K>;
    setStyle(key: any, value: any): DOMUtils<K>;
    setStyles(styles: NormalObject): DOMUtils<K>;
    setAttributes(attributes: NormalObject): DOMUtils<K>;
    setAttribute(key: string, value: any): DOMUtils<K>;
    prependTo(root: HTMLElement): this;
    appendChild(element: HTMLElement): this;
    findDom(selector: string): HTMLElement | null;
    getInstance(): K;
    static createInstance<T extends HTMLElementMap>(element: T): DOMUtils<T>;
    static createUtilDom<T extends keyof HTMLElementTagNameMap>(tagName: T): DOMUtils<HTMLElementTagNameMap[T]>;
}
export default DOMUtils;
