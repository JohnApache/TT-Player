import EventEmitter from 'eventemitter3';
import Options, { OptionsType } from './options';
import PlayerHooks from './hooks';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

interface PluginCtor{
    pluginName: string;
    new (player: TTPlayerCore): Plugin;
}

interface InstalledPluginsMap {
    [key: string]: boolean;
}

interface PluginsMap {
    [key: string]: Plugin;
}

class TTPlayerCore {

    static pluginsCtor: PluginCtor[] = [];
    static installedPluginsMap: InstalledPluginsMap = {}

    public event: EventEmitter;
    public options: Options;
    public root: DOMUtils<HTMLElement>;
    public pluginsCtor: PluginCtor[] = [];

    public plugins: Plugin[] = [];
    public pluginsMap: PluginsMap = {};

    constructor (options: Partial<OptionsType>) {
        this.event = new EventEmitter();
        this.options = new Options(options);
        this.root = new DOMUtils(this.options.root);
        this.pluginsCtor = TTPlayerCore.pluginsCtor;
    }

    static use (ctor: PluginCtor) {
        const pluginName = ctor.pluginName;
        if (!pluginName) throw new Error(`plugin's name cannot be empty`);

        const installed = this.installedPluginsMap[ctor.pluginName];
        if (installed) return this;

        this.pluginsCtor.push(ctor);
        return this;
    }

    init () {
        this.event.emit(PlayerHooks.BeforeInit);
        this.installPlugins()
            .render()
            .ready();
        return this;
    }

    destroy () {
        this.event.emit(PlayerHooks.BeforeDestroy);
        this.plugins.forEach(plug => plug.destroy());
        this.event.emit(PlayerHooks.Destroyed);
        return this;
    }

    private ready () {
        this.event.emit(PlayerHooks.Ready);
        return this;
    }

    private render () {
        this.event.emit(PlayerHooks.BeforeRender);
        this.renderPlugins()
            .renderContainer();

        this.event.emit(PlayerHooks.Rendered);
        return this;
    }

    private renderContainer () {
        const { width, height } = this.options;
        this.root
            .addClass('ttplayer--container')
            .css({ width, height });
        return this;
    }

    private renderPlugins () {
        this.plugins.forEach(plug => plug.render && plug.render());
        return this;
    }

    private installPlugins (): TTPlayerCore {
        this.pluginsCtor.forEach(plug => {
            const plugInstance = new plug(this);
            this.pluginsMap[plug.pluginName] = plugInstance;
            this.plugins.push(plugInstance);
            plugInstance.init();
        });
        return this;
    }

    private removePlugin (pluginName: string): TTPlayerCore {
        this.pluginsCtor = this.pluginsCtor.filter(ctor => ctor.pluginName !== pluginName);
        TTPlayerCore.pluginsCtor = this.pluginsCtor;
        this.plugins = this.plugins.filter(plug => plug.pluginName !== pluginName);

        const plug = this.pluginsMap[pluginName];
        plug.destroy();
        delete this.pluginsMap[pluginName];
        return this;
    }

    private addPlugin (ctor: PluginCtor): TTPlayerCore {
        if (this.pluginsCtor.some(plug => plug.pluginName === ctor.pluginName)) {
            const error = new Error('The plug-in already exists.');
            this.event.emit(PlayerHooks.Error, error);
            throw error;
        }

        this.pluginsCtor.push(ctor);
        TTPlayerCore.pluginsCtor = this.pluginsCtor;

        const plugInstance = new ctor(this);
        this.plugins.push(plugInstance);
        this.pluginsMap[plugInstance.pluginName] = plugInstance;
        plugInstance.init();
        plugInstance.render();
        return this;
    }

}

export { PlayerHooks };

export abstract class Plugin {

    static pluginName: string;

    abstract pluginName: string;
    abstract init(): any;
    abstract render(): any;
    abstract destroy(): any;

}

export default TTPlayerCore;
