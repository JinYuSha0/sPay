const mongoose = require('mongoose')
const { Schema } = mongoose

const qrcodeSchema = new Schema({
    id: { type: String, required: true, index: true },
    account: { type: String, required: true, index: true },
    amount: { type: Number, required: true, index: true },
    desc: { type: String, required: true, unique: true, index: true },
    qrCodeUrl: { type: String, required: true, unique: true },
    printQrCodeUrl: { type: String, required: true, unique: true },
}, {
    timestamps: true,
})

qrcodeSchema.query.byAmount = function(amount, descNin = []) {
    return new Promise((resolve, reject) => {
        this.find(
            { amount, desc: { $nin: descNin } },
            function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        ).limit(1)
    })
}

module.exports = {
    name: 'QRCode',
    schema: qrcodeSchema,
}
