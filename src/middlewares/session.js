module.exports = async (ctx, next) => {
    if (!ctx.session.init) {
        ctx.session.order = null
        ctx.session.init = true
    }

    await next()
}