const UUID = require('uuid')
const utils = require('../../../utils/utils')
const { config } = require('../../../constant/config')
const error = require('@constant/error')
const createQRCode = require('@services/createQRCode')

module.exports = async (ctx, next) => {
    const { socket, taskPool, getModelsPromise, redis } = ctx.state
    const { amount, name, memo } = ctx.request.body

    if (utils.isNil(amount) || isNaN(amount)) {
        throw error.Error400
    }

    if (utils.isNil(name)) {
        throw error.Error400
    }

    if (!ctx.session.order || ctx.session.order.timestamp < +new Date()) {
        const { QRCodeModel, OrderModel } = await getModelsPromise()
        const actives = (await redis.keysAsync('active-*')).map(name => name.replace('active-', ''))
        let qrcodeObj = (await QRCodeModel.find().byAmount(amount, actives))[0]
    
        if (!qrcodeObj) {
            qrcodeObj = await createQRCode({
                socket,
                taskPool,
                QRCodeModel,
                amount,
            })
        }
    
        const oid = UUID.v1()
        const { qrCodeUrl, desc } = qrcodeObj
        await new OrderModel({
            oid,
            qrcodeDesc: desc,
            amount,
            name,
            memo,
        }).save()
        await redis.set(`active-${oid}`, JSON.stringify({ desc }), 'EX', config.payTimeoutSec)
    
        ctx.session.order = {
            oid,
            name,
            memo,
            amount,
            qrCodeUrl,
            timestamp: +new Date() + (config.payTimeoutSec * 1000),
        }
    }

    ctx.response.redirect('/process')
}