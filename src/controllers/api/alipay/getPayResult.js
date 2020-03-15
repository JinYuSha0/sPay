const error = require('@constant/error')

module.exports = async (ctx, next) => {
    const { redis, taskPool } = ctx.state
    const { oid } = ctx.query

    let content
    const key = `active-${oid}`
    const isExists = await redis.existsAsync(key)

    if (isExists) {
        const ttl = await redis.ttlAsync(key)
        content = await taskPool.subscribe(key, ttl * 1000)
        // 清空session
        ctx.session.order = null
    } else {
        throw error.Error403
    }

    ctx.body = { code: 200, ...content }
}