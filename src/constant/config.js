exports.ioConfig = {
    path: '/io',            // 路径
    serveClient: false,     // 是否提供客户端文件
    pingTimeout: 30 * 1000, // 没有pong包后30秒关闭连接
    pingInterval: 5 * 1000, // 间隔5秒发送一个ping包
}

exports.config = {
    privateKey: '123456',
    payTimeoutSec: 5 * 60,
    mongodbUrl: 'mongodb://root:123456@localhost:27017/spay?authSource=admin',
    redisUrl: 'redis://localhost:6379',
}