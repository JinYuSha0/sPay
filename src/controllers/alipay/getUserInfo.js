const utils = require('../../utils/utils')
const event = require('../../constant/event')
const { TaskPool } = utils

module.exports = async (ctx, next) => {
    const { socket, taskPool } = ctx.state

    const taskId = TaskPool.genTaskId()
    socket.emit(event.GET_USER_INFO)
    const content = await taskPool.subscribe(taskId)
    ctx.body = content
}