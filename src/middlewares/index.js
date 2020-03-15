const DIRECT = {
    errCatch: require('./errorCatch'),
    // session: require('./session'),
}

const INDIRECT = {
    globalState: require('./globalState')
}

const PART = {
    socket: require('./socket')
}

function apply(app, externalParams) {
    Object.keys(DIRECT).forEach((name) => {
        app.use(DIRECT[name])
    })

    Object.keys(INDIRECT).forEach((name) => {
        app.use(INDIRECT[name](externalParams))
    })
}

module.exports = {
    ...DIRECT,
    ...INDIRECT,
    ...PART,
    apply,
}
