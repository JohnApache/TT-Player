import EventEmitter from 'eventemitter3';
import { PLUGIN_NAME } from './config';
import VideoControlOptions from './options';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerVideoControl extends Plugin {

    static pluginName: string = PLUGIN_NAME;
    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public root: DOMUtils<HTMLElement>;
    public control: DOMUtils<HTMLDivElement>;
    public options: VideoControlOptions;

    constructor (player: TTPlayerCore) {
        super();
        this.player = player;
        this.event = player.event;
        this.root = player.root;
        this.control = DOMUtils.createUtilDom('div');
        this.options = new VideoControlOptions(player.options.videoControl);
    }

    init () {
        this.bindEvents()
            .bindActions()
            .initControl()
            .loadControlComponents()
            .render();
        return this;
    }

    render () {
        this.root.append(this.control.getInstance());
        return this;
    }

    destroy () {
        this.removeEvents()
            .removeActions();
        return this;
    }

    private initControl () {
        const { height } = this.options;
        this.control
            .addClass('ttplayer__video--control')
            .css({
                height  : height,
                position: 'relative',
            });
        return this;
    }

    private loadControlComponents () {
        return this;
    }

    private bindEvents () {
        return this;
    }

    private bindActions () {
        return this;
    }

    private removeEvents () {
        return this;
    }

    private removeActions () {
        return this;
    }

}

export default TTPlayerVideoControl;
