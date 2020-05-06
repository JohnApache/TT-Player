import EventEmitter from 'eventemitter3';
import { ILogger } from '../logger';
import { LifeCycle } from '../base';
import TTPlayerMedia, { TMediaType, IMediaTypeMap } from './media';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerMediaComponent<T extends TMediaType> extends LifeCycle {

    public media: TTPlayerMedia<T>;
    public mediaDom: IMediaTypeMap[T];
    public logger: ILogger;
    public root: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;

    // public state: NormalObject = {};

    constructor (media: TTPlayerMedia<T>) {
        super();
        this.media = media;
        this.mediaDom = media.mediaDom;
        this.event = media.event;
        this.logger = media.logger;
        this.root = DOMUtils.createUtilDom('div');
    }

    // Consider 要不要加这个玩意
    // protected setState (newState: NormalObject) {
    //     console.log(newState);
    // }

}

export default TTPlayerMediaComponent;
