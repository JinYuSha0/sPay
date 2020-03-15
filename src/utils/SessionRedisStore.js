const { Store } = require('koa-session2')

class SessionRedisStore extends Store {
    constructor(redis) {
        super()
        this.redis = redis
    }

    async get(sid, ctx) {
        let data = (await this.redis.getAsync(`SESSION:${sid}`))
        return JSON.parse(data)
    }

    async set(session, { sid = this.getID(24), maxAge = 1000000 } = {}, ctx) {
        try {
            // Use redis set EX to automatically drop expired sessions
            await this.redis.setAsync(`SESSION:${sid}`, JSON.stringify(session), 'EX', maxAge / 1000)
        } catch (e) {}
        return sid
    }

    async destroy(sid, ctx) {
        return await this.redis.delAsync(`SESSION:${sid}`)
    }
}

module.exports = SessionRedisStore