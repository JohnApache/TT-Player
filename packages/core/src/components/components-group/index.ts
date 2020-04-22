import TTPlayerMedia, { TMediaType, TTPlayerMediaComponent } from '../../media/media';

interface GroupComponentCtor<T extends TMediaType> {
    new (media: TTPlayerMedia<TMediaType>): TTPlayerMediaComponent<T>;
}

abstract class TTPlayerComponentsGroup<T extends TMediaType> extends TTPlayerMediaComponent<T> {

    static groupComponentsCtor: GroupComponentCtor<TMediaType>[] = [];
    public groupComponents: TTPlayerMediaComponent<TMediaType>[] = [];

    constructor (media: TTPlayerMedia<T>) {
        super(media);
    }

    static use (ctor: GroupComponentCtor<TMediaType>) {
        this.groupComponentsCtor.push(ctor);
        return this;
    }

    beforeMount () {
        this.logger.info('TTPlayerComponentsGroup beforeMount');
        this.renderGroup();
        this.initGroupComponents();
    }

    mounted () {
        this.logger.info('TTPlayerComponentsGroup mounted');
        this.groupComponents.forEach(comp => comp.mounted());
    }

    beforeDestroy () {
        this.logger.info('TTPlayerComponentsGroup beforeDestroy');
        this.groupComponents.forEach(comp => comp.beforeDestroy());
    }

    abstract renderGroup(): any;

    private initGroupComponents () {
        /* eslint-disable */
        (this.constructor as typeof TTPlayerComponentsGroup).groupComponentsCtor.forEach(ctor => {
            const comp = new ctor(this.media);
            comp.beforeMount();
            this.groupComponents.push(comp);
            this.root.append(comp.root.getInstance());
        });
        /* eslint-enable */
    }

}


export default TTPlayerComponentsGroup;
