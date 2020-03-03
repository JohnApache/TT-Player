export type MoveArea = [number, number, number, number];

export interface MoveOptions {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    moveX: boolean;
    moveY: boolean;
    debug: boolean;
}

export interface MoveProxyCallbackParams {
    offsetX: number;
    offsetY: number;
    curX: number;
    curY: number;
    startX: number;
    startY: number;
}
export type MoveProxyCallback = (params: MoveProxyCallbackParams)=> any;

export interface MoveHooks {
    onMouseDown: (event: MouseEvent)=> any;
    onMouseMove: (event: MouseEvent)=> any;
    onMouseUp: (event: MouseEvent)=> any;
}

export type RemoveMovable = ()=> any;


export interface MoveDomType {
    dom: HTMLElement;
    options?: Partial<MoveOptions>;
}
