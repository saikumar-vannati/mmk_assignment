const logger = require("../logger");
const models = require("../models");
const cache = require("./cache")

exports.handleInboundSMS = async function handleInboundSMS(from, to, text, accountId) {

    const number = await models.phone_number.getPhoneNumberByAccountId(to, accountId);

    if (!number) {
        return "to parameter not found"
    }

    if (text.toLowerCase().includes("stop")) {
        cache.setKey(`${from}_${to}`, "1", { EX: process.env.REDIS_EXPIRY })
    }

    return 0;
}

exports.handleOutboundSMS = async function handleOutboundSMS(from, to, text, accountId) {

    let isCached = await cache.getKey(`${from}_${to}`)
    if (isCached) {
        return `sms from ${from} to ${to} blocked by STOP request`
    }

    const number = await models.phone_number.getPhoneNumberByAccountId(from, accountId);

    if (!number) {
        return "from parameter not found"
    }

    await resetCounterIfExpired(from)

    let smsCount = await cache.getKey(from)
    if (Number(smsCount) >= Number(process.env.SMS_LIMIT)) {
        return `limit reached for from ${from}`
    }
    cache.incrementKey(from).catch(logger.error)

    return 0;
}

async function resetCounterIfExpired(from) {

    let firstSMSTime = await cache.getKey(`${from}_first_sms_time`)

    let currentTimeStamp = new Date().getTime() / 1000;

    if (Number(firstSMSTime))  {
        if (currentTimeStamp - Number(firstSMSTime) >= Number(process.env.FROM_SMS_EXPIRY)) {
            await cache.setKey(from, 0)
            await cache.setKey(`${from}_first_sms_time`, currentTimeStamp)
        }
    } else {
        await cache.setKey(from, 0)
        await cache.setKey(`${from}_first_sms_time`, currentTimeStamp)
    }
}