import {
    MoveHooks,
    RemoveMovable,
    MoveOptions,
    MoveDomType,
} from './type';

const SUPPORT_POSITIONS = [
    'absolute',
    'relative',
    'fixed',
];

const isNumber = (data: any): data is number => typeof data === 'number';

const getStyle = (dom: HTMLElement, propertyName: string): string => window.getComputedStyle(dom).getPropertyValue(propertyName);

const MovableProxy = (
    sourceDom: HTMLElement,
    moveDoms: MoveDomType[],
    moveProxyHooks?: Partial<MoveHooks>,
): RemoveMovable => {
    const {
        onMouseMove,
        onMouseDown,
        onMouseUp,
    } = moveProxyHooks || {};

    const moveDomsMap = moveDoms.map(domMap => {
        const { options, dom } = domMap;
        let Position = getStyle(dom, 'position');
        if (SUPPORT_POSITIONS.indexOf(Position) === -1) {
            dom.style.position = 'relative';
            Position = 'relative';
        }
        const isRelative = Position === 'relative';

        const {
            maxX, maxY, minX, minY, debug,
        } = options || {};

        const left = isRelative ? parseFloat(getStyle(dom, 'left')) : dom.offsetLeft;
        const top = isRelative ? parseFloat(getStyle(dom, 'top')) : dom.offsetTop;

        debug && console.log(dom);
        debug && console.log(`minX: ${ minX } maxX: ${ maxX } minY: ${ minY } maxY: ${ maxY }`);

        return {
            isRelative,
            dom,
            options,
            left,
            top,
        };
    });

    const handleMouseDown = (event: MouseEvent) => {
        onMouseDown && onMouseDown(event);
        const startX = event.clientX;
        const startY = event.clientY;

        moveDomsMap.forEach(domMap => {
            const {
                isRelative, dom, options,
            } = domMap;
            const { debug } = options || {};

            const left = isRelative ? parseFloat(getStyle(dom, 'left')) : dom.offsetLeft;
            const top = isRelative ? parseFloat(getStyle(dom, 'top')) : dom.offsetTop;
            domMap.left = left;
            domMap.top = top;

            debug && console.log(domMap.dom);
            debug && console.log(`[mousedown] startX: ${ startX } startY: ${ startY } left: ${ left } top: ${ top }`);
        });

        const handleMouseMove = (event: MouseEvent) => {
            onMouseMove && onMouseMove(event);
            const curX = event.clientX;
            const curY = event.clientY;
            moveDomsMap.forEach(domMap => {
                const {
                    left, top, options, dom,
                } = domMap;

                const {
                    maxX, maxY, minX, minY, moveX, moveY, debug,
                } = options || {};

                let targetLeft = left + curX - startX;
                let targetTop = top + curY - startY;
                if (isNumber(minX) && targetLeft < minX) targetLeft = minX;
                if (isNumber(maxX) && targetLeft > maxX) targetLeft = maxX;
                if (isNumber(minY) && targetTop < minY) targetTop = minY;
                if (isNumber(maxY) && targetTop > maxY) targetTop = maxY;

                debug && console.log(dom);
                debug && console.log(`[mousemove] curX: ${ curX } curY: ${ curY } targetLeft: ${ targetLeft } targetTop: ${ targetTop }`);

                moveX && (dom.style.left = `${ targetLeft }px`);
                moveY && (dom.style.top = `${ targetTop }px`);
            });
        };

        const handleMouseUp = (event: MouseEvent) => {
            onMouseUp && onMouseUp(event);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    sourceDom.addEventListener('mousedown', handleMouseDown);

    return () => {
        sourceDom.removeEventListener('mousedown', handleMouseDown);
    };

};

const Movable = (
    dom: HTMLElement,
    options?: Partial<MoveOptions>,
    moveHooks?: Partial<MoveHooks>,
): RemoveMovable => MovableProxy(dom, [{ dom, options }], moveHooks);

export { MovableProxy, Movable };

export default Movable;
