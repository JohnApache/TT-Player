import EventEmitter from 'eventemitter3';
import { PLUGIN_NAME } from './config';
import PlayButtonOptions from './options';
import SVGIcons from '@dking/ttplayer-svg-icons';
import { DispatchAction } from '@dking/ttplayer-video';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';

class VideoPlayButton extends Plugin {

    static pluginName: string = PLUGIN_NAME;

    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public options: PlayButtonOptions;
    public paused: boolean = true;
    public button: DOMUtils<HTMLButtonElement>;
    public root: DOMUtils<HTMLElement>;
    public icon: SVGIcons;
    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (player: TTPlayerCore) {
        super();

        this.player = player;
        this.root = this.player.root;
        this.event = this.player.event;
        this.options = new PlayButtonOptions(this.player.options.videoPlayButton);
        this.button = DOMUtils.createUtilDom('button');
        this.icon = new SVGIcons({ svgName: 'play' });
        this.icon.init();
    }

    init () {
        this.bindEvents()
            .bindActions()
            .initButton()
            .render();
        return this;
    }

    render () {
        this.root.append(this.button.getInstance());
        return this;
    }

    destroy () {
        this.removeEvents()
            .removeActions();
        return this;
    }

    private initButton () {
        const { size } = this.options;
        this.button
            .addClass('ttplayer__video__play--button')
            .css({ width: `${ size }px`, height: `${ size }px` })
            .append(this.icon.getInstance());

        return this;
    }

    private handleClick () {
        const { DispatchPlayAction, DispatchPauseAction } = DispatchAction;
        this.paused ? DispatchPlayAction(this.event) : DispatchPauseAction(this.event);
        return this;
    }

    private handlePause () {
        if (this.paused) return;
        this.paused = true;
        this.renderPlaySvg();
        return this;
    }

    private handlePlay () {
        if (!this.paused) return;
        this.paused = false;
        this.renderPausedSvg();
        return this;
    }

    private renderPausedSvg () {
        this.icon.animatePathBySvgName('pause');
        return this;
    }

    private renderPlaySvg () {
        this.icon.animatePathBySvgName('play');
        return this;
    }

    private bindEvents () {
        const handlePlay = this.handlePlay.bind(this);
        const handlePause = this.handlePause.bind(this);
        this.event.on(`play`, handlePlay);
        this.event.on(`pause`, handlePause);

        const offHandlePlay = () => {
            this.event.off('play', handlePlay);
        };

        const offHandlePause = () => {
            this.event.off('pause', handlePause);
        };

        this.ugs.push(offHandlePlay, offHandlePause);

        return this;
    }

    private bindActions () {
        const handle = this.handleClick.bind(this);
        this.button.on('click', handle);

        this.actUgs.push(() => {
            this.button.off('click', handle);
        });

        return this;
    }

    private removeEvents () {
        this.ugs.forEach(ug => ug());
        this.ugs = [];
        return this;
    }

    private removeActions () {
        this.actUgs.forEach(ug => ug());
        this.actUgs = [];
        return this;
    }

}


export default VideoPlayButton;
