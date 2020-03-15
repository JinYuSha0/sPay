const mongoose = require('mongoose')
const { Schema } = mongoose

const orderSchema = new Schema({
    oid: { type: String, required: true, unique: true, index: true },
    uid: { type: String, index: true },
    qrcodeDesc: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    name: { type: String },
    memo: { type: String },
    status: { type: Number, default: 1 }    // 1 等待支付 2 支付完成
}, {
    timestamps: true,
})

orderSchema.query.getRecentlyOrderbyDesc = function(qrcodeDesc) {
    return new Promise((resolve, reject) => {
        this.find(
            { qrcodeDesc },
            function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve(data)
                }
            }
        )
        .sort({_id: -1})
        .limit(1)
    })
}

orderSchema.statics.updateStatusByOid = function(oid, status = 2) {
    return new Promise((resolve, reject) => {
        this.update(
            { oid },
            { status},
            function (err, raw) {
                if (err) {
                    reject(err)
                } else {
                    resolve(raw)
                }
            }
        )
    })
}

module.exports = {
    name: 'Order',
    schema: orderSchema,
}