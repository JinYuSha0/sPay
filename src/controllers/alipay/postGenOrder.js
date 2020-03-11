const utils = require('../../utils/utils')
const { config } = require('../../constant/config')
const error = require('../../constant/error')
const createQRCode = require('../../services/createQRCode')
const { promisify } = require('util')

module.exports = async (ctx, next) => {
    const { socket, taskPool, getModelsPromise, redis } = ctx.state
    const { amount } = ctx.query
    const keysAsync = promisify(redis.keys).bind(redis)

    if (utils.isNil(amount) || isNaN(amount)) {
        throw error.Error400
    }

    const { QRCodeModel } = await getModelsPromise()
    const actives = (await keysAsync('active-*')).map(name => name.replace('active-', ''))
    let qrcodeObj = (await QRCodeModel.find().byAmount(amount, actives))[0]

    if (!qrcodeObj) {
        qrcodeObj = await createQRCode({
            socket,
            taskPool,
            QRCodeModel,
            amount,
        })
    }

    const { qrCodeUrl, desc } = qrcodeObj
    await redis.set(`active-${desc}`, 'session', 'EX', config.payTimeoutSec)

    ctx.body = {
        timestamp: +new Date() + (config.payTimeoutSec * 1000),
        qrCodeUrl,
        oid: desc,
    }
}