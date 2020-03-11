const Koa = require('koa2')
const app = new Koa()
const utils = require('./src/utils/utils')
const controllers = require('./src/controllers/index')
const middlewares = require('./src/middlewares/index')
const { db, redis } = require('./src/models/index')
const socket = require('./src/socket/index')
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server, require('./src/constant/config').ioConfig)

const { TaskPool, asyncMemo } = utils
const taskPool = new TaskPool()

const getSocket = socket(io, taskPool)
const getModelsPromise = asyncMemo(db())

middlewares.apply(app, {
    taskPool,
    controllers,
    getSocket: () => getSocket().socket,
    getModelsPromise,
    redis,
})
app.use(controllers.routes()).use(controllers.allowedMethods())

server.listen(3000, function () {
    console.log(`server start on port ${3000}`)
})
