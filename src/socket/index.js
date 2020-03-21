const event = require('@constant/event')
const { config } = require('@constant/config')
const getBillList = require('@services/getBillList')

module.exports = (io, taskPool, getModelsPromise) => {
    let _socket = null, isConnect = false

    io.on(event.CONNECT, (socket) => {
        const { privateKey } = socket.handshake.query
        if (privateKey !== config.privateKey || isConnect) {
            socket.disconnect()
        } else {
            _socket = socket
            isConnect = true
            console.log('Device connect success')
    
            socket.on(event.DIS_CONNECT, () => {
                _socket = null
                isConnect = false
                console.log('Device disconnect')
            })

            socket.on(event.COLLECT_MONEY, async (tradeNO, _) => {
                const { OrderModel } = await getModelsPromise()

                // 账单列表
                const billList = await getBillList(socket, taskPool)
                // todo 获取大于上次处理时间戳的订单
                // todo 通过billDetail获取二维码描述
                // todo 抽象出来做防抖处理

                // 获取最近一条使用该二维码描述的订单
                const currOrder = (await OrderModel.find().getRecentlyOrderbyDesc(qrcodeDesc))[0]
                // 更新订单状态
                await OrderModel.updateStatusByOid(currOrder.oid, 2)
                // 结束该任务
                taskPool.finish(`active-${currOrder.oid}`, {
                    oid: currOrder.oid,
                    tradeNO,
                })
            })
    
            socket.on(event.GET_QR_CODE_SUCCESS, (taskId, data) => {
                try {
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
    
            socket.on(event.GET_USER_INFO_SUCCESS, (taskId, data) => {
                try {
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
    
            socket.on(event.GET_BILL_LIST_SUCCESS, (taskId, data) => {
                try {
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })

            socket.on(event.GET_BILL_DETAIL_SUCCESS, (taskId, data) => {
                try {
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })

            socket.on(event.GET_MY_INFO_SUCCESS, (taskId, data) => {
                try {
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
        }
    })

    return () => ({ socket: _socket, isConnect })
}