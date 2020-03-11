const utils = require('../utils/utils')
const event = require('../constant/event')
const { TaskPool } = utils

module.exports = async (socket, taskPool) => {
    const taskId = TaskPool.genTaskId()
    socket.emit(event.GET_BILL_DETAIL, taskId)
    const content = await taskPool.subscribe(taskId, 10 * 1000)
    return JSON.parse(content)
}