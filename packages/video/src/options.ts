import {
    IVideoOptions, MSEType, FlvJsOption, HlsJsOption, DashJsOption, WebTorrentOption,
} from './type';

import { MediaOptions } from '@dking/ttplayer-core';

const DEFAULT_OPTIONS = {
    src       : '',
    width     : 600,
    height    : 300,
    poster    : '',
    tabindex  : 2,
    flvjs     : {},
    hlsjs     : {},
    dashjs    : {},
    webtorrent: {},
    type      : 'auto' as MSEType,
};

class VideoOptions extends MediaOptions {

    public width: number | string;
    public height: number | string;
    public poster: string;
    public tabindex: number;
    public type: MSEType;
    public flvjs: Partial<FlvJsOption> = {};
    public hlsjs: Partial<HlsJsOption> = {};
    public dashjs: Partial<DashJsOption> = {};
    public webtorrent: Partial<WebTorrentOption> = {};

    constructor (options: IVideoOptions = {}) {
        super(options);
        this.width = options.width || DEFAULT_OPTIONS.width;
        this.height = options.height || DEFAULT_OPTIONS.height;
        this.poster = options.poster || DEFAULT_OPTIONS.poster;
        this.tabindex = options.tabindex || DEFAULT_OPTIONS.tabindex;

        this.type = options.type || DEFAULT_OPTIONS.type;

        this.flvjs = options.flvjs || DEFAULT_OPTIONS.flvjs;
        this.hlsjs = options.hlsjs || DEFAULT_OPTIONS.hlsjs;
        this.dashjs = options.dashjs || DEFAULT_OPTIONS.dashjs;
        this.webtorrent = options.webtorrent || DEFAULT_OPTIONS.webtorrent;

    }

}

export default VideoOptions;
