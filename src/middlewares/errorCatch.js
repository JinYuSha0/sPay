const utils = require('../utils/utils')
const errorCode = require('../constant/errorCode')

module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if (!utils.isNil(err)) {
            if (err instanceof Error) {
                ctx.status = err.code || 500
                err = { code: errorCode.DEFAULT, msg: err.message }
            }
        } else {
            err = { code: errorCode.DEFAULT, msg: 'Internal Server Error' }
        }
        ctx.body = err
    }
}