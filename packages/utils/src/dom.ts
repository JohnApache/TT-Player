import bUtils from './browser';

type HTMLElementMap = HTMLElementTagNameMap[keyof HTMLElementTagNameMap];

interface NormalObject {
    [key: string]: any;
}

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

    prependTo (root: HTMLElement) {
        root.insertBefore(this.element, root.firstChild);
        return this;
    }

    appendChild (element: HTMLElement) {
        this.element.appendChild(element);
        return this;
    }

    findDom (selector: string): HTMLElement | null {
        if (typeof this.element.querySelector === 'function') {
            return this.element.querySelector(selector);
        }

        return bUtils.findDom(selector);
    }

    getInstance () {
        return this.element;
    }

    static createInstance <T extends HTMLElementMap> (element: T): DOMUtils<T> {
        return new DOMUtils(element);
    }

    static createUtilDom <T extends keyof HTMLElementTagNameMap> (tagName: T): DOMUtils<HTMLElementTagNameMap[T]> {
        return new DOMUtils(bUtils.createDom(tagName));
    }

}

export default DOMUtils;
