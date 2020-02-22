import EventEmitter from 'eventemitter3';
import { DispatchPauseAction, DispatchPlayAction } from '@dking/ttplayer-video/src/dispatch';
import pasition from 'pasition';
import { PLUGIN_NAME, DEFAULT_PASITION_TIME } from './config';
import PlayButtonOptions from './options';
import { dUtils as DOMUtils } from '@dking/ttplayer-utils';
import TTPlayerCore, { Plugin } from '@dking/ttplayer-core';


interface PlayButtonSVGPaths {
    play: string;
    pause: string;
}

class VideoPlayButton extends Plugin {

    static pluginName: string = PLUGIN_NAME;

    public pluginName: string = PLUGIN_NAME;
    public player: TTPlayerCore;
    public event: EventEmitter;
    public options: PlayButtonOptions;
    public paused: boolean = true;
    public button: DOMUtils<HTMLButtonElement>;
    public root: DOMUtils<HTMLElement>;

    public svgPaths: PlayButtonSVGPaths = {
        play : 'M576,363L810,512L576,661zM342,214L576,363L576,661L342,810z',
        pause: 'M598,214h170v596h-170v-596zM256 810v-596h170v596h-170z',
    }

    private ugs: Function[] = [];
    private actUgs: Function[] = [];

    constructor (player: TTPlayerCore) {
        super();
        this.player = player;
        this.root = this.player.root;
        this.event = this.player.event;
        this.options = new PlayButtonOptions(this.player.options.videoPlayButton);
        this.button = DOMUtils.createUtilDom('button');
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
        const DEFAULT_SIZE = 1024;

        const fixedCount = 8;
        const scale = (size / DEFAULT_SIZE).toFixed(fixedCount);
        this.button
            .addClass('ttplayer__video__play--button')
            .css({ width: `${ size }px`, height: `${ size }px` })
            .html(`
            <svg 
                class='button__svg'
                xmlns="http://www.w3.org/2000/svg"
                width="1024" 
                height="1024" 
                viewBox="0 0 1024 1024"
            >
                <circle 
                    class='button__svg--circle'
                    transform="scale(${ scale } ${ scale })" 
                    cx="516" 
                    cy="516" 
                    r="516" 
                    fill="#000" 
                    fill-opacity="0.5"
                />
                <path 
                    class='button__svg--path' 
                    fill="#fff" 
                    fill-opacity="0.9"
                    transform="scale(${ scale } ${ scale })" 
                    d="${ this.svgPaths.play }">
                </path>
            </svg>
        `);
        return this;
    }

    private handleClick () {
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
        this.pasitionSvg(this.svgPaths.play, this.svgPaths.pause);
        return this;
    }

    private renderPlaySvg () {
        this.pasitionSvg(this.svgPaths.pause, this.svgPaths.play);
        return this;
    }

    private pasitionSvg (from: string, to: string) {
        const path = this.button.findDom('path');
        if (!path) return;
        pasition.animate({
            from,
            to,
            time    : DEFAULT_PASITION_TIME,
            progress: shapes => {
                path.setAttribute('d', this.toSVGString(shapes));
            },
        });
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

    private toSVGString (shapes: (number | string)[][][]): string {
        /*克隆一下实时数据*/
        //var shapes = JSON.parse(JSON.stringify(shapes||[]));
        /*对数据中的每个点数组做处理
        * */
        return shapes.map(function(shape) {
            shape.forEach(function(point, idx) {
                if (!idx) {
                    /*
                    * 若是第一个点数组，那么对该点数组的处理是前面加M,然后前两个点后面加C
                    * */
                    point.splice(2, 0, 'C');
                    point.unshift('M');
                } else {
                    /*
                    * 除了第一个点数据外,所有的点数组的前两个点删除掉
                    * */
                    point.splice(0, 2, 'C');
                }
            });
            return shape.map(function(point) {
                return point.join(' ');
            }).join('');
        }).join('');
    }

}


export default VideoPlayButton;
