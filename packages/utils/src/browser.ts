const BrowserUtils = {

    createDom <K extends keyof HTMLElementTagNameMap> (tagName: K): HTMLElementTagNameMap[K] {
        const dom = document.createElement(tagName);
        return dom;
    },

    findDom (selector: string): HTMLElement | null {
        if (typeof document.querySelector === 'function') {
            return document.querySelector(selector);
        }

        if (selector.startsWith('#')) {
            return document.getElementById(selector.slice(1));
        }

        if (selector.startsWith('.')) {
            return document.getElementsByClassName(selector.slice(1))[0] as HTMLElement;
        }

        return null;
    },

};

export default BrowserUtils;
