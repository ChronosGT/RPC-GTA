import log4js from "log4js";

Date.prototype.yyyymmddhm = function ()  {
    const monthNames = [
        "января", "февраля", "марта",
        "апреля", "мая", "июня", "июля",
        "августа", "сентября", "октября",
        "ноября", "декабря"
    ];

    let mm = this.getMonth();
    let dd = this.getDate();
    let h = this.getHours();
    let m = this.getMinutes();

    if (m === 0) {
        m = "00";
    }

    if (0 < m && m < 10) {
        m = "0" + m;
    }

    return `${dd} ${monthNames[mm]} ${this.getFullYear()} | ${h}:${m}`;
};

log4js.configure({
    "appenders": {
        "out": { "type": "stdout" },
        "debug": { "type": "dateFile", "filename": "./logs/debug/debug", "pattern": "yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
        "debug-filter": { "type": "logLevelFilter", "appender": "debug", "level": "debug" },
        "result": { "type": "dateFile", "filename": "./logs/result/result", "pattern": "yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
        "result-filter": { "type": "logLevelFilter", "appender": "result", "level": "info" },
        "error": { "type": "dateFile", "filename": "./logs/error/error", "pattern": "yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
        "error-filter": { "type": "logLevelFilter", "appender": "error", "level": "error" },
        "default": { "type": "dateFile", "filename": "./logs/default/default", "pattern": "yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
        "warn": { "type": "dateFile", "filename": "./logs/warn/warn", "pattern": "yyyy-MM-dd.log", "alwaysIncludePattern": true, "keepFileExt": true },
        "warn-filter": { "type": "logLevelFilter", "appender": "warn", "level": "warn" }
    },
    "categories": {
        "default": { "appenders": ["out", "default"], "level": "info" },
        "debug": { "appenders": ["debug", "debug-filter"], "level": "debug" },
        "result": { "appenders": ["result", "result-filter"], "level": "info" },
        "error": { "appenders": ["error", "error-filter"], "level": "error" },
        "warn": { "appenders": ["warn", "warn-filter"], "level": "warn" }
    }
});

const logger = log4js.getLogger();

export { logger as default }
