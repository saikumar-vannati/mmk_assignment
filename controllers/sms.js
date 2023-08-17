const smsService = require('../core/sms')
const logger = require('../logger')

const { responseFormatter } = require("../utils")

module.exports = {

    inboundSMS: async function (req, res) {

        try {

            const {
                from,
                to,
                text
            } = req.body

            let error = await smsService.handleInboundSMS(from, to, text, req.user.id)

            if (error) return res.status(400).send(responseFormatter("", error))
            return res.status(200).send(responseFormatter("inbound sms ok", ""))
        } catch (err) {
            logger.error(err)
            return res.status(500).send(responseFormatter("", "unknown failure"))
        }
    },

    outboundSMS: async function (req, res) {

        try {

            const {
                from,
                to,
                text
            } = req.body

            let error = await smsService.handleOutboundSMS(from, to, text, req.user.id)

            if (error) return res.status(400).send(responseFormatter("", error))
            return res.status(200).send(responseFormatter("outbound sms ok", ""))
        } catch (err) {
            logger.error(err)
            return res.status(500).send(responseFormatter("", "unknown failure"))
        }
    }
}