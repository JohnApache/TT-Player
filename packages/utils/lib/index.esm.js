/* Created By @dking/hasaki-cli */
const BrowserUtils = {
    createDom(tagName) {
        const dom = document.createElement(tagName);
        return dom;
    },
    findDom(selector) {
        if (typeof document.querySelector === 'function') {
            return document.querySelector(selector);
        }
        if (selector.startsWith('#')) {
            return document.getElementById(selector.slice(1));
        }
        if (selector.startsWith('.')) {
            return document.getElementsByClassName(selector.slice(1))[0];
        }
        return null;
    },
};

class DOMUtils {
    constructor(element) {
        this.element = element;
    }
    get className() {
        return this.element.className.trim();
    }
    get classList() {
        return this.className.split(/\s+/g);
    }
    hasClass(className) {
        if (this.element.classList) {
            return Array.prototype.some.call(this.element.classList, item => item === className);
        }
        return this.classList.some(item => item === className);
    }
    addClass(className) {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                item && this.element.classList.add(item);
            });
        }
        else {
            this.element.className += ` ${classList.join(' ')}`;
        }
        return this;
    }
    removeClass(className) {
        const classList = className.trim().split(/\s+/g);
        if (this.element.classList) {
            classList.forEach(item => {
                this.element.classList.remove(item);
            });
        }
        else if (this.hasClass(className)) {
            this.element.className = this.classList.filter(item => classList.every(v => v !== item)).join(' ');
        }
        return this;
    }
    setStyle(key, value) {
        this.element.style[key] = value;
        return this;
    }
    setStyles(styles) {
        Object.keys(styles).forEach(item => {
            this.setStyle(item, styles[item]);
        });
        return this;
    }
    setAttributes(attributes) {
        Object.keys(attributes).forEach(attr => {
            this.setAttribute(attr, attributes[attr]);
        });
        return this;
    }
    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        return this;
    }
    prependTo(root) {
        root.insertBefore(this.element, root.firstChild);
        return this;
    }
    appendChild(element) {
        this.element.appendChild(element);
        return this;
    }
    findDom(selector) {
        if (typeof this.element.querySelector === 'function') {
            return this.element.querySelector(selector);
        }
        return BrowserUtils.findDom(selector);
    }
    getInstance() {
        return this.element;
    }
    static createInstance(element) {
        return new DOMUtils(element);
    }
    static createUtilDom(tagName) {
        return new DOMUtils(BrowserUtils.createDom(tagName));
    }
}

const BaseUtils = { isString: (data) => typeof data === 'string' };

export { BrowserUtils as bUtils, DOMUtils as dUtils, BaseUtils as utils };
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */
