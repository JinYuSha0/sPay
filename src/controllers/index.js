const Router = require('koa-router')
const alipayRouter = require('./alipay/index')

const router = new Router()

router.use('/a', alipayRouter.routes(), alipayRouter.allowedMethods())

router.get('*', async (ctx, next) => {
    ctx.status = 404
    ctx.body = '404 Not Found'
})

module.exports = router