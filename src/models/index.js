const mongoose = require('mongoose')
const Redis = require('redis')

const { config } = require('../constant/config')

const schemas = {
    qrcode: require('./qrcode'),
}

exports.db = async () => {
    try {
        const models = {}

        const db = await mongoose.connect(config.mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        Object.keys(schemas).forEach((_name) => {
            const { name, schema } = schemas[_name]
            models[name + 'Model'] = mongoose.model(name, schema)
        })

        console.log('connect mongodb success: ', models)
        return models
    } catch (err) {
        console.log('connect mongodb error: ', err.message)
        process.exit()
    }
}

exports.redis = Redis.createClient(config.redisUrl)