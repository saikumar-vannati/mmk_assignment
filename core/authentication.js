const models = require("../models")
const { responseFormatter } = require("../utils")

async function basicAuth(req, res, next) {

    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(403).send(responseFormatter("", "Invalid Authorization Header"));
    }

    // verify auth credentials
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    const user = await models.account.getUserAccount(username, password)

    if (!user) {
        return res.status(403).send(responseFormatter("", "Invalid Authorization Header"));
    }

    req.user = user

    next();
}

module.exports = {
    basicAuth
}