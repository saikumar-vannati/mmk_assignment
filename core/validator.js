const { responseFormatter } = require('../utils')

function validate(req, res, next) {

    const schema = {
        "from": {
            type: "string",
            min: 6,
            max: 16,
            required: true
        },
        "to": {
            type: "string",
            min: 6,
            max: 16,
            required: true
        },
        "text": {
            type: "string",
            min: 1,
            max: 120,
            required: true
        }
    }

    for (let key in schema) {

        if (!(key in req.body)) {
            return res.status(400).send(responseFormatter("", `${key} is missing`))
        }

        if (typeof req.body[key] != schema[key].type) {

            return res.status(400).send(responseFormatter("", `${key} is invalid`))
        }

        if (req.body[key].length < schema[key].min || req.body[key].length > schema[key].max) {

            return res.status(400).send(responseFormatter("", `${key} is invalid`))
        }
    }

    next()
}

module.exports = validate