const getBillList = require('@services/getBillList')
const getBillDetail = require('@services/getBillDetail')
const utils = require('@utils/utils')
const { throttle } =  require('loadsh')

async function collectMoney({
    getModelsPromise, redis, socket, taskPool,
}) {
    const { OrderModel } = await getModelsPromise()

    // 账单列表
    const billList = await getBillList(socket, taskPool)
    // 获取上次处理的最后时间戳
    const gmtCreate = await redis.getAsync('gmtCreate')
    // 过滤出在这个时间戳之后的订单
    const newBillList = billList.filter((bill) => gmtCreate < bill.gmtCreate)
    // 生成任务
    function dealBillTsak(bizInNo) {
        return new Promise(async (resolve, reject) => {
            try {
                const { tradeNo, desc } = await getBillDetail({ socket, taskPool, tradeNo: bizInNo })
                // 获取最近一条使用该二维码描述的订单
                const currOrder = (await OrderModel.find().getRecentlyOrderbyDesc(desc))[0]
                // 更新订单状态
                await OrderModel.updateStatusByOid(currOrder.oid, 2)
                // 结束该任务
                taskPool.finish(`active-${currOrder.oid}`, {
                    oid: currOrder.oid,
                    tradeNO: tradeNo,
                })
                resolve(tradeNo)
            } catch (e) {
                reject(e)
            }
        })
    }
    if (newBillList.length > 0) {
        // 任务列表
        const bizInNoList = newBillList.map((bill) => (bill.bizInNo)).map((bizInNo) => (dealBillTsak(bizInNo)))                            
        // 等待完成
        await Promise.all(bizInNoList)
        // 更新时间
        const maxGmtCreate = utils.getMax(newBillList.map((bill) => (bill.gmtCreate)))
        redis.setAsync('gmtCreate', maxGmtCreate)
    }
}

// 节流处理
module.exports = throttle(collectMoney, 1000)