import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';

interface GroupComponentCtor<T extends TMediaType> {
    new (media: TTPlayerMedia<TMediaType>): TTPlayerMediaComponent<T>;
}

// Consider 怎么建立组合后的，组件间的通信
class TTPlayerComponentsGroup<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static className: string = 'ttplayer__media__component--group';
    static groupComponentsCtor: GroupComponentCtor<TMediaType>[] = [];
    public groupComponents: TTPlayerMediaComponent<TMediaType>[] = [];

    constructor (media: TTPlayerMedia<T>) {
        super(media);
    }

    static use (ctor: GroupComponentCtor<TMediaType>) {
        this.groupComponentsCtor.push(ctor);
        return this;
    }

    componentWillMount () {
        this.logger.debug('TTPlayerComponentsGroup componentWillMount');
        this.initGroupComponents();
    }

    componentDidMount () {
        this.logger.debug('TTPlayerComponentsGroup componentDidMount');
        this.groupComponents.forEach(comp => comp.componentDidMount());
    }

    componentWillUnmount () {
        this.logger.debug('TTPlayerComponentsGroup componentWillUnmount');
        this.groupComponents.forEach(comp => comp.componentWillUnmount());
    }

    beforeRender () {
        this.root
            .addClass(this.className);
    }

    private initGroupComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerComponentsGroup).groupComponentsCtor.forEach(ctor => {
            const comp = new ctor(this.media);
            comp.componentWillMount();
            comp.beforeRender();
            comp.render();
            this.groupComponents.push(comp);
            this.root.append(comp.root.getInstance());
        });
        /* eslint-enable */
    }

}


export default TTPlayerComponentsGroup;
