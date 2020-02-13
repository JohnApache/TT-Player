import { EventEmitter } from 'events';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import Options, { OptionsType } from './options';
interface InstalledPluginsMap {
    [key: string]: boolean;
}
interface PluginCtor {
    pluginName: string;
    new (player: TTPlayerCore): any;
}
declare class TTPlayerCore {
    static pluginsCtor: PluginCtor[];
    static installedPluginsMap: InstalledPluginsMap;
    private plugins;
    private pluginsMap;
    event: EventEmitter;
    options: Options;
    pluginsCtor: PluginCtor[];
    root: DOMUtils<HTMLElement>;
    constructor(options: Partial<OptionsType>);
    init(): void;
    private ready;
    private render;
    private renderContainer;
    private renderPlugins;
    private installPlugins;
    private unInstallPlugin;
    static use(ctor: PluginCtor): typeof TTPlayerCore;
}
export default TTPlayerCore;
