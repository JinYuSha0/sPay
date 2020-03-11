const errorCode = require('../constant/errorCode')

module.exports = (externalParams) => async (ctx, next) => {
    const { taskPool, getSocket, getModelsPromise, redis } = externalParams

    ctx.state.taskPool = taskPool
    ctx.state.socket = getSocket()
    ctx.state.getModelsPromise = getModelsPromise
    ctx.state.redis = redis

    await next()
}