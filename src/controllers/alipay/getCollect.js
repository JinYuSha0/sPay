const getBillDetail = require('../../services/getBillDetail')

module.exports = async (ctx, next) => {
    const { tradeNO } = ctx.query
    const { socket, taskPool } = ctx.state
    const { list } = await getBillDetail(socket, taskPool)
    const currOrder = list.filter(item => item.bizInNo === tradeNO)[0]
    const { consumeTitle } = currOrder
    const oid = `active-${consumeTitle.slice(0, consumeTitle.lastIndexOf('-'))}`
    taskPool.finish(oid, currOrder)
    ctx.body = tradeNO
}