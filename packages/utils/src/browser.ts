export const CreateDom = <K extends keyof HTMLElementTagNameMap> (tagName: K): HTMLElementTagNameMap[K] => {
    const dom = document.createElement(tagName);
    return dom;
};


export const FindDom  = (selector: string): HTMLElement | null => {
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
};

export const FindAllDoms  = (selector: string): NodeListOf<HTMLElement> | null => {
    if (typeof document.querySelectorAll === 'function') {
        return document.querySelectorAll(selector);
    }

    return null;
};
