const PlayerHooks = {
    BeforeInit       : 'BeforeInit',
    Ready            : 'Ready',
    BeforeRender     : 'BeforeRender',
    Rendered         : 'Rendered',
    BeforeDestroy    : 'BeforeDestroy',
    Destroyed        : 'Destroyed',
    Error            : 'Error',
    Screenshot       : 'Screenshot',
    ScreenshotSuccess: 'ScreenshotSuccess',
    ScreenshotError  : 'ScreenshotError',
    SwitchQuality    : 'SwitchQuality',
    FullscreenChange : 'FullscreenChange',
    AutoPlaySuccess  : 'AutoPlaySuccess',
    AutoPlayError    : 'AutoPlayError',
    PlayNext         : 'PlayNext',
    PlayPrev         : 'PlayPrev',
    SwitchPlayItem   : 'SwitchPlayItem',

    DynamicUpdateOptions: 'DynamicUpdateOptions',
};

export default PlayerHooks;
