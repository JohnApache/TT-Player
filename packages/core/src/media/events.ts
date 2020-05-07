// 事件触发顺序
// onloadstart
// ondurationchange
// onloadedmetadata
// onloadeddata
// onprogress
// oncanplay
// oncanplaythrough

// 影响媒体加载的事件有：
// onabort
// onemptied
// onerror
// onsuspend

export const MEDIA_NATIVE_EVENTS: string[] = [
    'abort', // 多媒体数据终止加载时触发，而不是发生错误时触发。ie11不支持
    'play',
    'playing', // 事件在视频/音频（audio/video）暂停或者在缓冲后准备重新开始播放时触发。
    'pause',
    'ended', // 事件在视频/音频（audio/video）播放结束时触发。
    'error',
    'seeking', // 事件在用户开始重新定位视频/音频（audio/video）时触发。
    'seeked', // 事件在用户重新定位视频/音频（audio/video）的播放位置后触发。
    'timeupdate', // 事件在当前的播放位置发送改变时触发。
    'waiting', // 事件在视频由于要播放下一帧而需要缓冲时触发。
    'canplay', // 事件在用户可以开始播放视频/音频（audio/video）时触发。
    'canplaythrough', // 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发
    'durationchange', // 事件在视频/音频（audio/video）的时长发生变化时触发。
    'volumechange',
    'loadstart', // 事件在浏览器开始寻找指定视频/音频（audio/video）触发
    'loadeddata', // 事件在浏览器加载视频/音频（audio/video）当前帧时触发触发。
    'loadedmetadata', // 事件在指定视频/音频（audio/video）的元数据加载后触发。
    'progress', // 事件在浏览器下载指定的视频/音频（audio/video）时触发
    'ratechange', // 事件在视频/音频（audio/video）的播放速度发送改变时触发。
    'stalled', // 事件在浏览器获取媒体数据，但媒体数据不可用时触发,
    'suspend', // 事件在浏览器读取媒体数据中止时触发。
    'emptied', // 当前播放列表为空时触发, 媒体被清空（初始化）时触发。

    /** Video New Events **/
    'enterpictureinpicture', // 进入 PIP 模式
    'leavepictureinpicture', // 离开 PIP 模式

];
