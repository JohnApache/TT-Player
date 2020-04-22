import EventEmitter from 'eventemitter3';
import { ILogger } from '../logger';
import TTPlayerMedia, { TMediaType, IMediaTypeMap } from './media';
import { DOMUtils } from '@dking/ttplayer-utils';

class TTPlayerMediaComponent<T extends TMediaType> {

    public media: TTPlayerMedia<T>;
    public mediaDom: IMediaTypeMap[T];
    public logger: ILogger;
    public root: DOMUtils<HTMLDivElement>;
    public event: EventEmitter;

    constructor (media: TTPlayerMedia<T>) {
        this.media = media;
        this.mediaDom = media.mediaDom;
        this.event = media.event;
        this.logger = media.logger;
        this.root = DOMUtils.createUtilDom('div');
    }

    beforeMount () {}
    mounted () {}
    beforeDestroy () {}

}

export default TTPlayerMediaComponent;
