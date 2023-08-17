const { createClient } = require('redis');
const logger = require('../logger');
const URL = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
console.log(URL)
const client = createClient({ url: URL,  legacyMode: false})

client.on('error', err => console.log('Redis Client Error', err));

client.connect().catch(err => {
    console.log(err)
})

exports.setKey = async function set(key, value, options) {
    await client.set(key, value, options);
}

exports.getKey = async function get(key) {
    let value = await client.get(key)
    // logger.debug(`${key}: ${value}`)
    return value
}

exports.incrementKey = async function incr(key) {

    await client.INCR(key)
}
