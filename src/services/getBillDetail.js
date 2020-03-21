const utils = require('@utils/utils')
const event = require('@constant/event')
const error = require('@constant/error')
const { TaskPool } = utils

module.exports = async ({
    socket, taskPool, tradeNo
}) => {
    if (utils.isNil(tradeNo)) {
        throw error.Error400
    }

    const taskId = TaskPool.genTaskId()
    socket.emit(event.GET_BILL_DETAIL,taskId,tradeNo)
    const content = await taskPool.subscribe(taskId)
    let desc = ''
    try {
        desc = content.match(/(?<=content\\":\\")[^{]*?(?=商品说明)/)[0].match(/(.*?)\\",/)[1]
    } catch(_) {}
    return { tradeNo, desc }
}