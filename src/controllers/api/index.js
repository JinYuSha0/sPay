const Router = require('koa-router')
const alipayRouter = require('./alipay')

const ApiRouter = new Router()

ApiRouter.use('/a', alipayRouter.routes(), alipayRouter.allowedMethods())

module.exports = ApiRouter