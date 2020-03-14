const Router = require('koa-router')

const PageRouter = new Router()

PageRouter.get('/pay', require('./pay'))

module.exports = PageRouter