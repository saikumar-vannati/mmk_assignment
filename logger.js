// Basic console logger, can be improved to write to file

const logger = {
    debug: message => console.debug(`${new Date().toISOString()} | DEBUG | ${message}`),

    info: message => console.info(`${new Date().toISOString()} | INFO  | ${message}`),

    error: errMsg => console.error(`${new Date().toISOString()} | ERROR | ${errMsg}`)
}

module.exports = logger