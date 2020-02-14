/* Created By @dking/hasaki-cli */
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
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */

const VideoError = 'VideoError';

const DEFAULT_OPTIONS = {
    src: '',
    width: 600,
    height: 300,
    volume: 0.6,
    autoplay: false,
    muted: false,
    loop: false,
    preload: 'none',
    poster: '',
    tabindex: 2,
    controls: false,
};
class VideoOptions {
    constructor(options) {
        this.src = options.src || DEFAULT_OPTIONS.src;
        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;
        this.volume = options.volume || DEFAULT_OPTIONS.volume;
        this.autoplay = options.autoplay || DEFAULT_OPTIONS.autoplay;
        this.muted = options.muted || DEFAULT_OPTIONS.muted;
        this.loop = options.loop || DEFAULT_OPTIONS.loop;
        this.preload = options.preload || 'none';
        this.poster = options.poster || DEFAULT_OPTIONS.poster;
        this.tabindex = options.tabindex || DEFAULT_OPTIONS.tabindex;
        this.controls = options.controls || DEFAULT_OPTIONS.controls;
        Object.keys(options).forEach(item => {
            if (typeof this[item] !== 'undefined')
                return;
            this[item] = options[item];
        });
    }
}

class TTPlayerVideo {
    constructor(player) {
        this.player = player;
        this.event = this.player.event;
        this.video = DOMUtils.createUtilDom('video');
        this.options = new VideoOptions(player.options);
        this.init();
    }
    init() {
        this.bindEvents()
            .initVideoStyle()
            .initVideoMedia();
        return this;
    }
    initVideoStyle() {
        this.video
            .addClass('ttplayer--video');
        return this;
    }
    initVideoMedia() {
        const { src, volume, muted, } = this.options;
        this.setVideoSrc(src)
            .setVolume(volume)
            .setMuted(muted);
        return this;
    }
    setVideoSrc(src) {
        const video = this.video.getInstance();
        if (!src || src.length <= 0) {
            this.event.emit(VideoError, new Error('invalid options.'));
            return this;
        }
        if (typeof src === 'string') {
            video.src = src;
            return this;
        }
        src.forEach(item => {
            const source = BrowserUtils.createDom('source');
            source.setAttribute('src', item.src);
            source.setAttribute('type', item.type || '');
            this.video.appendChild(source);
        });
        return this;
    }
    setVolume(volume) {
        const video = this.video.getInstance();
        video.volume = volume;
        return this;
    }
    setMuted(muted) {
        const video = this.video.getInstance();
        video.muted = muted;
        return this;
    }
    setPreload(preload) {
        const video = this.video.getInstance();
        video.preload = preload;
        return this;
    }
    bindEvents() {
        return this;
    }
}
TTPlayerVideo.pluginName = 'TTPlayerVideo';

export default TTPlayerVideo;
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */
