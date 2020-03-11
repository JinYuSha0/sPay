const Router = require('koa-router')
const middlewares = require('../../middlewares')

const AlipayRouter = new Router()

AlipayRouter.use(middlewares.socket)
AlipayRouter.get('/getPayeeQrcode', require('./getPayeeQrcode'))
AlipayRouter.get('/getUserInfo', require('./getUserInfo'))
AlipayRouter.get('/getBillDetail', require('./getBillDetail'))
AlipayRouter.get('/getMyInfo', require('./getMyInfo'))
AlipayRouter.get('/postGenOrder', require('./postGenOrder'))
AlipayRouter.get('/getPayResult', require('./getPayResult'))
AlipayRouter.get('/getCollect', require('./getCollect'))

module.exports = AlipayRouter