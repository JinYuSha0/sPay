module.exports = async (ctx, next) => {
    await ctx.render('./pay.pug', {}, true)
}