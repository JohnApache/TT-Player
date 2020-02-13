/* Created By @dking/hasaki-cli */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('events'), require('@dking/ttplayer-utils')) :
    typeof define === 'function' && define.amd ? define(['events', '@dking/ttplayer-utils'], factory) :
    (global = global || self, global.TTPlayerCore = factory(global.events, global.ttplayerUtils));
}(this, (function (events, ttplayerUtils) { 'use strict';

    const DEFAULT_OPTIONS = {
        width: 600,
        height: 300,
    };
    class Options {
        constructor(options) {
            if (!options.root)
                throw new Error(`root can't be empty`);
            if (typeof options.root === 'string') {
                const root = document.querySelector(options.root);
                if (!root)
                    throw new Error(`root can't be empty`);
                this.root = root;
            }
            else {
                this.root = options.root;
            }
            this.width = options.width || DEFAULT_OPTIONS.width;
            this.height = options.height || DEFAULT_OPTIONS.height;
            if (typeof this.width === 'number') {
                this.width = `${this.width}px`;
            }
            if (typeof this.height === 'number') {
                this.width = `${this.width}px`;
            }
            Object.keys(options).forEach(item => {
                if (item === 'width' || item === 'height' || item === 'root')
                    return;
                this[item] = options[item];
            });
        }
    }

    class TTPlayerCore {
        constructor(options) {
            this.plugins = [];
            this.pluginsMap = {};
            this.pluginsCtor = TTPlayerCore.pluginsCtor;
            this.event = new events.EventEmitter();
            this.options = new Options(options);
            this.root = new ttplayerUtils.dUtils(this.options.root);
            // new Video();
        }
        init() {
            this.installPlugins()
                .render()
                .ready();
        }
        ready() {
            this.event.emit('ready');
            return this;
        }
        render() {
            this.renderContainer()
                .renderPlugins();
            return this;
        }
        renderContainer() {
            const { width, height } = this.options;
            this.root
                .addClass('ttplayer--container')
                .setStyles({ width, height })
                .prependTo(this.options.root);
            return this;
        }
        renderPlugins() {
            this.plugins.forEach(plug => plug.render && plug.render());
        }
        installPlugins() {
            this.pluginsCtor.forEach(plug => {
                const plugInstance = new plug(this);
                this.pluginsMap[plug.pluginName] = plugInstance;
                this.plugins.push(plugInstance);
                plugInstance.init();
            });
            return this;
        }
        unInstallPlugin() {
            return this;
        }
        static use(ctor) {
            const installed = this.installedPluginsMap[ctor.pluginName];
            if (installed)
                return this;
            this.pluginsCtor.push(ctor);
            return this;
        }
    }
    TTPlayerCore.pluginsCtor = [];
    TTPlayerCore.installedPluginsMap = {};

    return TTPlayerCore;

})));
/* hasaki-cli git: https://github.com/JohnApache/hasaki-cli */
