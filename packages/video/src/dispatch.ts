import EventEmitter from 'eventemitter3';
import VideoActions from './actions';
import { VideoPreload } from './type';

export const DispatchPlayAction = (event: EventEmitter) => {
    event.emit(VideoActions.PlayAction);
};

export const DispatchPauseAction = (event: EventEmitter) => {
    event.emit(VideoActions.PauseAction);
};

export const DispatchVolumeAction = (event: EventEmitter, volume: number) => {
    event.emit(VideoActions.VolumeAction, volume);
};

export const DispatchMuteAction = (event: EventEmitter, muted: boolean) => {
    event.emit(VideoActions.MuteAction, muted);
};

export const DispatchLoopAction = (event: EventEmitter, loop: boolean) => {
    event.emit(VideoActions.LoopAction, loop);
};

export const DispatchPosterAction = (event: EventEmitter, poster: string) => {
    event.emit(VideoActions.PosterAction, poster);
};

export const DispatchPreloadAction = (event: EventEmitter, preload: VideoPreload) => {
    event.emit(VideoActions.PreloadAction, preload);
};

export const DispatchSeekAction = (event: EventEmitter, time: number) => {
    event.emit(VideoActions.SeekAction, time);
};
