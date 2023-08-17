const express = require('express')

const auth = require('../core/authentication')
const validate = require('../core/validator')
const smsController = require('../controllers/sms.js')
const router = express.Router()

router.post('/inbound/sms', auth.basicAuth, validate, smsController.inboundSMS)

router.post('/outbound/sms', auth.basicAuth, validate, smsController.outboundSMS)

module.exports = router