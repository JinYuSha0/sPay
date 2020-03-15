const Router = require('koa-router')

const PageRouter = new Router()

PageRouter.get('/', require('./pay'))
PageRouter.get('/process', require('./process'))

module.exports = PageRouter