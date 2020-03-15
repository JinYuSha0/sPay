module.exports = async (ctx, next) => {
    if (ctx.session && ctx.session.order && ctx.session.order.timestamp > +new Date()) {
        // oid, name, memo, amount, qrCodeUrl, timestamp
        await ctx.render('./process.pug', { 
            ...ctx.session.order,
            freeTime: ctx.session.order.timestamp - (+ new Date()),
        }, true)
    } else {
        ctx.session.order = null
        await ctx.response.redirect('/')
    }
}