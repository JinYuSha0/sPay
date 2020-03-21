const getBillList = require('@services/getBillList')

module.exports = async (ctx, next) => {
    const { socket, taskPool } = ctx.state
    const content = await getBillList(socket, taskPool)
    content.sort((a, b) => (b.gmtCreate - a.gmtCreate))
    ctx.body = content
}