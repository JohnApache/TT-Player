// import EventEmitter from 'eventemitter3';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import EventEmitter from 'eventemitter3';
import Options, { OptionsType } from './options';

interface Plugin {
    pluginName: string;
    [key: string]: any;
}

interface PluginsMap {
    [key: string]: Plugin;
}

interface InstalledPluginsMap {
    [key: string]: boolean;
}

interface PluginCtor {
    pluginName: string;
    new (player: TTPlayerCore): any;
}

class TTPlayerCore {

    static pluginsCtor: PluginCtor[] = [];
    static installedPluginsMap: InstalledPluginsMap = {}

    private plugins: Plugin[] = [];
    private pluginsMap: PluginsMap = {};

    public event: EventEmitter;
    public options: Options;
    public pluginsCtor: PluginCtor[];
    public root: DOMUtils<HTMLElement>;

    constructor (options: Partial<OptionsType>) {
        this.pluginsCtor = TTPlayerCore.pluginsCtor;
        this.event = new EventEmitter();
        this.options = new Options(options);
        this.root = new DOMUtils(this.options.root);
    }

    async test (): Promise<void> {
        await new Promise((resolve, reject) => {
            if (Math.random() > 0.1) {
                resolve();
                return;
            }
            reject();
        });
    }

    init () {
        this.installPlugins()
            .render()
            .ready();
    }

    private ready () {
        this.event.emit('ready');
        return this;
    }

    private render () {
        this.renderContainer()
            .renderPlugins();

        return this;
    }

    private renderContainer () {
        const { width, height } = this.options;
        this.root
            .addClass('ttplayer--container')
            .setStyles({ width, height })
            .prependTo(this.options.root);

        return this;
    }

    private renderPlugins () {
        this.plugins.forEach(plug => plug.render && plug.render());
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

    private unInstallPlugin (): TTPlayerCore {
        return this;
    }

    static use (ctor: PluginCtor) {
        const installed = this.installedPluginsMap[ctor.pluginName];
        if (installed) return this;

        this.pluginsCtor.push(ctor);
        return this;
    }

}

export default TTPlayerCore;
