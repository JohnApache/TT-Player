import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

abstract class TTPlayerTime<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public duration: number = 0;
    public currentTime: number = 0;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
    }

    abstract onTimeUpdate(e: Event): any;
    abstract onDurationChange(e: Event): any;
    abstract renderTime(): any;

    beforeMount () {
        this.logger.info('TTPlayerTime beforeMount');
        this.renderTime();
        this.bindTimeEvents();
    }

    mounted () {
        this.logger.info('TTPlayerTime mounted');
    }

    beforeDestroy () {
        this.logger.info('TTPlayerTime beforeDestroy');
        this.removeTimeEvents();
    }

    protected bindTimeEvents () {
        this.event.on('timeupdate', this.handleTimeUpdate);
        this.event.on('durationchange', this.handleDurationChange);
        return this;
    }

    protected removeTimeEvents () {
        this.event.off('timeupdate', this.handleTimeUpdate);
        this.event.off('durationchange', this.handleDurationChange);
        return this;
    }

    private handleDurationChange (e: Event) {
        this.duration = this.media.duration;
        this.logger.debug('media duration change to', this.duration);
        this.onDurationChange(e);
    }

    private handleTimeUpdate (e: Event) {
        this.currentTime = this.media.currentTime;
        this.logger.debug('media current time update to', this.currentTime);
        this.onTimeUpdate(e);
    }

    formatTime (second: number): string {
        if (!second || second <= 0) return '00:00';

        const ONE_HOUR = 3600;
        const ONE_MINUTE = 60;

        let h = 0,
            m = 0,
            s = 0;

        if (second >= ONE_HOUR) {
            h = Math.floor(second / ONE_HOUR);
        }
        if (second >= ONE_MINUTE) {
            m = Math.floor((second - h * ONE_HOUR) / ONE_MINUTE);
        }

        s = Math.floor(second - h * ONE_HOUR - m * ONE_MINUTE);

        return (
            h === 0 ?
                `${ this.fillTime(m) }:${ this.fillTime(s) }` :
                `${ this.fillTime(h) }:${ this.fillTime(m) }:${ this.fillTime(s) }`
        );
    }

    fillTime (t: number): string {
        const MIN_DOUBLE_NUM = 10;
        return t >= MIN_DOUBLE_NUM ? `${ t }` : `0${ t }`;
    }

}


export default TTPlayerTime;
