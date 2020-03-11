const Error400 = new Error('Bad Request')
Error400.code = 400

const Error403 = new Error('Forbidden Explained')
Error403.code = 403

module.exports = {
    Error400,
    Error403,
}