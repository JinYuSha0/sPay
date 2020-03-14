const getBillDetail = require('@services/getBillDetail')

module.exports = async (ctx, next) => {
    const { socket, taskPool } = ctx.state
    const content = await getBillDetail(socket, taskPool)
    ctx.body = content
}