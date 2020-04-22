import {
    IVideoOptions, MSEType, FlvJsOption, HlsJsOption, DashJsOption, WebTorrentOption,
} from './type';

import { TTPlayerVideoOptions } from '@dking/ttplayer-core';

const DEFAULT_OPTIONS = {
    flvjs     : {},
    hlsjs     : {},
    dashjs    : {},
    webtorrent: {},
    type      : 'auto' as MSEType,
};

class VideoOptions extends TTPlayerVideoOptions {

    public type: MSEType;
    public flvjs: Partial<FlvJsOption> = {};
    public hlsjs: Partial<HlsJsOption> = {};
    public dashjs: Partial<DashJsOption> = {};
    public webtorrent: Partial<WebTorrentOption> = {};

    constructor (options: IVideoOptions = {}) {
        super(options);
        this.type = options.type || DEFAULT_OPTIONS.type;
        this.flvjs = options.flvjs || DEFAULT_OPTIONS.flvjs;
        this.hlsjs = options.hlsjs || DEFAULT_OPTIONS.hlsjs;
        this.dashjs = options.dashjs || DEFAULT_OPTIONS.dashjs;
        this.webtorrent = options.webtorrent || DEFAULT_OPTIONS.webtorrent;
    }

}

export default VideoOptions;
