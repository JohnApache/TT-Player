import TTPlayerMedia, { TTPlayerMediaComponent, TMediaType } from '../../media/media';

class TTPlayerTime<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    public duration: number = 0;
    public currentTime: number = 0;

    constructor (media: TTPlayerMedia<T>) {
        super(media);
        this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
    }

    componentWillMount () {
        this.logger.debug('TTPlayerTime componentWillMount');
        this.bindTimeEvents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerTime componentDidMount');
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerTime componentWillUnmount');
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

    private handleDurationChange () {
        this.duration = this.media.duration;

        this.logger.debug('media duration change to', this.duration);
        this.render();
    }

    private handleTimeUpdate () {
        this.currentTime = this.media.currentTime;

        // this.logger.debug('media current time update to', this.currentTime);
        this.render();
    }

    formatTime (second: number): string {
        if (!second || second <= 0) return '00:00';
        if (second === Infinity) return 'Infinity:Infinity';
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
