require('module-alias/register')

const Koa = require('koa2')
const app = new Koa()
const utils = require('@utils/utils')
const controllers = require('@controllers')
const middlewares = require('@middlewares')
const { db, redis } = require('@models')
const socket = require('@socket')
const server = require('http').createServer(app.callback())
const config = require('@constant/config')
const io = require('socket.io')(server, config.ioConfig)
const path = require('path')
const Pug = require('koa-pug')
const static = require('koa-static')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session2')
const SessionRedisStore = require('@utils/SessionRedisStore')

const { TaskPool, asyncMemo } = utils
const taskPool = new TaskPool()
const pug = new Pug({
    viewPath: path.resolve(__dirname, './src/views'),
    debug: false,
    pretty: true,
    compileDebug: false,
})

const getSocket = socket(io, taskPool)
const getModelsPromise = asyncMemo(db())

app.keys = [config.config.session.key]
app.use(session({
    ...config.config.session,
    store: new SessionRedisStore(redis),
}))
app.use(static(path.resolve(__dirname, './src/views/static')))
app.use(bodyParser())
middlewares.apply(app, {
    taskPool,
    controllers,
    getSocket: () => getSocket().socket,
    getModelsPromise,
    redis,
})
pug.use(app)
app.use(controllers.routes()).use(controllers.allowedMethods())

server.listen(3000, function () {
    console.log(`server start on port ${3000}`)
})
