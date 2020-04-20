import utils from '@dking/ttplayer-utils';

type TLogCallback = (...content: any[])=> void;

interface ILogger {
    info: TLogCallback;
    log: TLogCallback;
    debug: TLogCallback;
    warn: TLogCallback;
    error: TLogCallback;
}

interface ILoggerOptions {
    info: boolean;
    debug: boolean;
    log: boolean;
    error: boolean;
    warn: boolean;
    prefix: string;
}

const DEFAULT_LOG_PREFIX = 'TTPlayer';
const DEFAULT_LOG_OPTIONS: ILoggerOptions = {
    info  : true,
    debug : true,
    log   : true,
    warn  : true,
    error : true,
    prefix: DEFAULT_LOG_PREFIX,
};

const fillTime = (t: number): string => {
    const MIN_DOUBLE_NUM = 10;
    return t >= MIN_DOUBLE_NUM ? `${ t }` : `0${ t }`;
};

const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const h = date.getHours();
    const m = date.getHours();
    const s = date.getHours();
    const ms = date.getMilliseconds();
    return `[${ fillTime(h) }:${ fillTime(m) }:${ fillTime(s) }:${ ms }]`;
};

const logger = (prefix: string, logType: keyof ILogger, flag: boolean, ...content: any[]) => {
    flag && console[logType](prefix, formatTime(Date.now()), ...content);
};

const CreateLogger = (logOptions?: boolean | Partial<ILoggerOptions>): ILogger => {
    let params;
    if (utils.isUndefined(logOptions) || utils.isBoolean(logOptions)) {
        params = logOptions ? DEFAULT_LOG_OPTIONS : {};
    } else {
        params = {
            ...DEFAULT_LOG_OPTIONS,
            ...logOptions,
        };
    }

    const logPrefix = params.prefix || DEFAULT_LOG_PREFIX;

    return {
        info : logger.bind(null, logPrefix, 'info', Boolean(params.info)),
        debug: logger.bind(null, logPrefix, 'debug', Boolean(params.debug)),
        warn : logger.bind(null, logPrefix, 'warn', Boolean(params.warn)),
        error: logger.bind(null, logPrefix, 'error', Boolean(params.error)),
        log  : logger.bind(null, logPrefix, 'log', Boolean(params.log)),
    };
};

export { ILogger };

export default CreateLogger;
