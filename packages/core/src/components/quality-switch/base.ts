import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';
import Hooks from '../../hooks';

interface IQualityItem {
    url: string;
    name?: string;
    type?: string;
}

class TTPlayerBaseQuality<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className: string = 'ttplayer__media__component--quality';
    public current: number = -1;
    public qualityList: IQualityItem [] = [];

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        const quality = media.options.quality || {};
        this.qualityList = quality.qualityList || [];
        this.qualityList.forEach((item, index) => {
            if (item.url === this.media.src) {
                this.current = index;
            }
        });
        this.handleQualityChange = this.handleQualityChange.bind(this);
    }

    componentWillMount () {
        this.bindQualityEvents();
    }

    componentWillUnmount () {
        this.removeQualityEvents();
    }

    private bindQualityEvents () {
        this.event.on(Hooks.SwitchQuality, this.handleQualityChange);
    }

    private removeQualityEvents () {
        this.event.off(Hooks.SwitchQuality, this.handleQualityChange);
    }

    private handleQualityChange (index: number) {
        this.current = index;
        this.render();
    }

}

export { IQualityItem };

export default TTPlayerBaseQuality;
