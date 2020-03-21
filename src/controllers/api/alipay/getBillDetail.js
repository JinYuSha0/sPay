const getBillDetail = require('@services/getBillDetail')

module.exports = async (ctx, next) => {
    const { socket, taskPool } = ctx.state
    const { tradeNo } = ctx.query
    const res = await getBillDetail({ socket, taskPool, tradeNo })
    ctx.body = res
}