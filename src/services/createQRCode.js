const event = require('@constant/event')
const utils = require('@utils/utils')
const { TaskPool } = utils

module.exports = async ({
    socket, taskPool, amount, desc, QRCodeModel
}) => {
    const taskId = TaskPool.genTaskId()
    if (utils.isNil(desc)) {
        desc = `o-${TaskPool.genTaskId()}`
    }
    socket.emit(event.GET_QR_CODE, taskId, JSON.stringify({ amount, desc }))
    const content = JSON.parse(await taskPool.subscribe(taskId))
    // const { account, qrCodeUrl, printQrCodeUrl } = content

    const result = Object.assign(content, {
        id: taskId,
        amount,
        desc,
    })

    await new QRCodeModel(result).save()

    return result
}