const getBillDetail = require('@services/getBillDetail')

module.exports = async (ctx, next) => {
    const { tradeNO } = ctx.query
    const { socket, taskPool, getModelsPromise } = ctx.state
    const { OrderModel } = await getModelsPromise()

    const { list } = await getBillDetail(socket, taskPool)
    const { consumeTitle } = list.filter(item => item.bizInNo === tradeNO)[0]
    // 二维码描述
    const qrcodeDesc = `${consumeTitle.slice(0, consumeTitle.lastIndexOf('-'))}`
    // 获取最近一条使用该二维码描述的订单
    const currOrder = (await OrderModel.find().getRecentlyOrderbyDesc(qrcodeDesc))[0]
    // 更新订单状态
    await OrderModel.updateStatusByOid(currOrder.oid, 2)
    // 结束该任务
    taskPool.finish(`active-${currOrder.oid}`, {
        oid: currOrder.oid,
        tradeNO,
    })
    
    ctx.body = tradeNO
}