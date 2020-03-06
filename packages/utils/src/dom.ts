import {
    isUndefined, isString, isNumber,
} from './base';
import {
    FindDom, CreateDom, FindAllDoms,
} from './browser';


interface NormalObject {
    [key: string]: any;
}

interface SelectorAttributes {
    id: string;
    className: string;
}

type HTMLElementMap = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
type CSSStyleKey = keyof CSSStyleDeclaration;
type ValidCSSStyleKey = Exclude<CSSStyleKey, 'length'| 'parentRule' | number>;


class DOMUtils <K extends HTMLElementMap> {

    constructor (private element: K) {
    }

    get className (): string {
        return this.element.className.trim();
    }

    get classList (): string[] {
        return this.className.split(/\s+/g);
    }

    hasClass (className: string): boolean {
        if (this.element.classList) {
            return Array.prototype.some.call(this.element.classList, item => item === className);
        }
        return this.classList.some(item => item === className);
    }

    addClass (className: string): DOMUtils<K> {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                item && this.element.classList.add(item);
            });
        } else {
            this.element.className += ` ${ classList.join(' ') }`;
        }
        return this;
    }

    removeClass (className: string): DOMUtils<K> {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                this.element.classList.remove(item);
            });
        } else if (this.hasClass(className)) {
            this.element.className = this.classList.filter(item => classList.every(v => v !== item)).join(' ');
        }

        return this;
    }

    setStyle (key: any, value: any): DOMUtils<K> {
        this.element.style[key] = value;
        return this;
    }

    setStyles (styles: NormalObject): DOMUtils<K> {
        Object.keys(styles).forEach(item => {
            this.setStyle(item, styles[item]);
        });
        return this;
    }

    setAttributes (attributes: NormalObject): DOMUtils<K> {
        Object.keys(attributes).forEach(attr => {
            this.setAttribute(attr, attributes[attr]);
        });
        return this;
    }

    setAttribute (key: string, value: any): DOMUtils<K> {
        this.element.setAttribute(key, value);
        return this;
    }

    getAttribute (key: string): string | null {
        return this.element.getAttribute(key);
    }

    prepend (ele: HTMLElement) {
        this.element.insertBefore(ele, this.element.firstChild);
        return this;
    }

    prependTo (root: HTMLElement) {
        root.insertBefore(this.element, root.firstChild);
        return this;
    }

    append (element: HTMLElement) {
        this.element.appendChild(element);
        return this;
    }

    appendTo (root: HTMLElement) {
        root.appendChild(this.element);
        return this;
    }

    findDom (selector: string): HTMLElement | null {
        if (typeof this.element.querySelector === 'function') {
            return this.element.querySelector(selector);
        }

        return FindDom(selector);
    }

    findAllDoms (selector: string): NodeListOf<HTMLElement> | null {
        if (typeof this.element.querySelectorAll === 'function') {
            return this.element.querySelectorAll(selector);
        }
        return FindAllDoms(selector);
    }

    find (selector: string): DOMUtils<HTMLElement> | null {
        const dom = this.findDom(selector);
        if (!dom) return null;
        return new DOMUtils(dom);
    }

    findAll (selector: string): DOMUtils<HTMLElement>[] | null {
        const doms = this.findAllDoms(selector);
        if (!doms) return null;
        const result = Array(doms.length);
        doms.forEach((dom, i) => {
            result[i] = new DOMUtils(dom);
        });
        return result;
    }

    remove (): DOMUtils<K>;
    remove (selector: string): DOMUtils<K>;
    remove (selector?: string): DOMUtils<K> {
        if (isString(selector)) {
            const doms = this.findAllDoms(selector);
            if (doms) {
                doms.forEach(dom => {
                    const parentNode = dom.parentNode;
                    if (parentNode) {
                        parentNode.removeChild(dom);
                    }
                });
            }
            return this;
        }

        const parentNode = this.element.parentNode;
        if (parentNode) {
            parentNode.removeChild(this.element);
        }
        return this;
    }

    html (): string;
    html (htmlString: string): DOMUtils<K>;
    html (htmlString?: string): string | DOMUtils<K> {
        if (isString(htmlString)) {
            this.element.innerHTML = htmlString;
            return this;
        }
        return this.element.innerHTML;
    }

    css (key: ValidCSSStyleKey): any;
    css (styles: NormalObject): DOMUtils<K>;
    css (key: ValidCSSStyleKey, value: any): DOMUtils<K>;
    css (key: ValidCSSStyleKey | NormalObject, value?: any): any | DOMUtils<K> {
        if (isString(key)) {
            if (isUndefined(value)) {
                return this.element.style[key];
            }
            this.element.style[key] = value;
            return this;
        }

        const styles = Object.keys(key) as ValidCSSStyleKey[];
        styles.forEach(item => {
            this.element.style[item] = key[item];
        });
        return this;
    }

    attr (key: string): any;
    attr (key: string, value: any): DOMUtils<K>;
    attr (key: NormalObject): DOMUtils<K>;
    attr (key: string | NormalObject, value?: any): DOMUtils<K> | any {
        if (!isString(key)) {
            return this.setAttributes(key);
        }
        if (isUndefined(value)) {
            return this.getAttribute(key);
        }
        return this.setAttribute(key, value);
    }

    on (eventName: string, fn: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
        this.element.addEventListener(eventName, fn, options);
        const offFn = this.off.bind(this, eventName, fn, options);
        return offFn;
    }

    off (eventName: string, fn: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
        this.element.removeEventListener(eventName, fn, options);
        return this;
    }

    getInstance () {
        return this.element;
    }

    height(h: number | string): void;
    height (): number;
    height (h?: number | string): number | void {
        if (isUndefined(h)) {
            return this.element.offsetHeight;
        }
        if (isNumber(h)) {
            this.css('height', `${ h }px`);
            return;
        }
        this.css('height', h);
    }

    width(w: number | string): void;
    width (): number;
    width (w?: number | string): number | void {
        if (isUndefined(w)) {
            return this.element.offsetWidth;
        }
        if (isNumber(w)) {
            this.css('width', `${ w }px`);
            return;
        }

        this.css('width', w);
    }

    getBoundingClientRect () {
        return this.element.getBoundingClientRect();
    }

    getComputedStyle (propertyName: string): string {
        return window.getComputedStyle(this.element).getPropertyValue(propertyName);
    }

    static createInstance <T extends HTMLElementMap> (element: T): DOMUtils<T> {
        return new DOMUtils(element);
    }

    static createUtilDom <T extends keyof HTMLElementTagNameMap> (
        tagName: T,
        selectorAttr?: Partial<SelectorAttributes> | string,
    ): DOMUtils<HTMLElementTagNameMap[T]> {
        const udom = new DOMUtils(CreateDom(tagName));
        if (!selectorAttr) return udom;
        if (isString(selectorAttr)) return udom.addClass(selectorAttr);

        const { id, className } = selectorAttr;
        isString(id) && udom.attr('id', id);
        isString(className) && udom.addClass(className);
        return udom;
    }

}

export default DOMUtils;
