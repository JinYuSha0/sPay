const event = require('@constant/event')
const { config } = require('@constant/config')
const collectMoney = require('@services/collectMoney')
const getBillList = require('@services/getBillList')

module.exports = (io, taskPool, getModelsPromise, redis) => {
    let _socket = null, isConnect = false

    io.on(event.CONNECT, async (socket) => {
        const { privateKey } = socket.handshake.query
        if (privateKey !== config.privateKey || isConnect) {
            socket.disconnect()
        } else {    
            socket.on(event.DIS_CONNECT, () => {
                _socket = null
                isConnect = false
                console.log('Device disconnect')
            })

            socket.on(event.COLLECT_MONEY, async () => {
                await collectMoney({
                    getModelsPromise,
                    redis,
                    socket,
                    taskPool,
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

            // 获取最近一笔收款的时间戳
            const billList = await getBillList(socket, taskPool)
            await redis.setAsync('gmtCreate', billList[0].gmtCreate)

            _socket = socket
            isConnect = true
            console.log('Device connect success')
        }
    })

    return () => ({ socket: _socket, isConnect })
}