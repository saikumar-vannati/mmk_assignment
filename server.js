require('dotenv').config()
const express = require('express')
const logger = require('./logger')
const models = require('./models')

const smsRouter = require('./routes/sms')

const PORT = process.env.APPLICATION_PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended:true }))


app.use("/", smsRouter);
// app.get("/numbers", async (req, res) => {

//     const numbers = await models.phone_number.findAll();
//     res.json(numbers)
// })

// app.get("/accounts", async (req, res) => {

//     const acc = await models.account.findAll();
//     res.json(acc)
// })

app.listen(PORT, () => {
    logger.info(`SERVER IS RUNNING ON PORT ${PORT}`)
});