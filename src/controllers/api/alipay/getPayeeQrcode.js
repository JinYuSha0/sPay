const createQRCode = require('@services/createQRCode')

module.exports = async (ctx, next) => {
    const { socket, taskPool, getModelsPromise } = ctx.state
    const { amount, desc } = ctx.query
    const { QRCodeModel } = await getModelsPromise()

    const content = await createQRCode({
        socket,
        taskPool,
        QRCodeModel,
        amount,
        desc
    })

    ctx.body = content
}