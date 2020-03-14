const event = require('@constant/event')
const { config } = require('@constant/config')

module.exports = (io, taskPool) => {
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
    
            socket.on(event.GET_QR_CODE_SUCCESS, (data) => {
                try {
                    const { taskId } = JSON.parse(data)
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
    
            socket.on(event.GET_USER_INFO_SUCCESS, (data) => {
                try {
                    const { taskId } = JSON.parse(data)
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
    
            socket.on(event.GET_BILL_DETAIL_SUCCESS, (data) => {
                try {
                    const { taskId } = JSON.parse(data)
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })

            socket.on(event.GET_MY_INFO_SUCCESS, (data) => {
                try {
                    const { taskId } = JSON.parse(data)
                    taskPool.finish(taskId, data)
                } catch(_) {}
            })
        }
    })

    return () => ({ socket: _socket, isConnect })
}