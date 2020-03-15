const Router = require('koa-router')
const apiRouter = require('./api')
const pageRouter = require('./page')

const router = new Router()

router.use(pageRouter.routes(), pageRouter.allowedMethods())
router.use('/api', apiRouter.routes(), apiRouter.allowedMethods())

router.get('*', async (ctx, next) => {
    ctx.status = 404
    ctx.body = '404 Not Found'
})

module.exports = router