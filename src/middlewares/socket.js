const errorCode = require('../constant/errorCode')

module.exports = async (ctx, next) => {
    const { socket } = ctx.state

    if (!socket || !socket.connected) {
        ctx.status = 500
        ctx.body = { code: errorCode.DEVICE_NOT_CONNCTED, msg: 'Device not connected' }
        return
    }

    await next()
}