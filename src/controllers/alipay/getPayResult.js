const error = require('../../constant/error')
const { config } = require('../../constant/config')
const { promisify } = require('util')

module.exports = async (ctx, next) => {
    const { redis, taskPool } = ctx.state
    const { oid } = ctx.query

    let content
    const key = `active-${oid}`
    const existsAsync = promisify(redis.exists).bind(redis)
    const isExists = await existsAsync(key)
    const ttlAsync = promisify(redis.ttl).bind(redis)

    if (isExists) {
        const ttl = await ttlAsync(key)
        content = await taskPool.subscribe(key, ttl * 1000)
    } else {
        throw error.Error403
    }

    ctx.body = content
}