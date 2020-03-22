const isNil = (obj) => {
    if (obj == '' || obj == null) {
        return true
    } else {
        return false
    }
}

class TaskPool {
    timeout = 5000
    taskMap = new Map()

    constructor(timeout) {
        if (!isNil(timeout)) {
            this.timeout = timeout
        }
    }

    static genTaskId() {
        return Math.random().toString(36).split('.')[1]
    }

    subscribe(taskId, timeout = this.timeout) {
        const task = this.taskMap.get(taskId)

        if (!task) {
            let resolve, reject
            const p = new Promise((_res, _rej) => {
                resolve = _res
                reject = _rej
            })

            const timerId = setTimeout(() => {
                reject({taskId, code: require('../constant/errorCode').TIME_OUT, msg: `${timeout}ms timeout exceed`})
                this.taskMap.delete(taskId)
            }, timeout)

            const clearTimer = () => {
                clearTimeout(timerId)
            }

            this.taskMap.set(taskId, {
                promise: p,
                resolve: compose(clearTimer, resolve),
                reject: compose(clearTimer, reject),
            })

            return p
        } else {
            return task.promise
        }
    }

    finish(taskId, content) {
        const taskProcess = this.taskMap.get(taskId)
        if (!isNil(taskProcess)) {
            const { resolve, reject } = taskProcess
            if (!isNil(content)) {
                resolve(content)
            } else {
                reject(new Error('value is null'))
            }
            this.taskMap.delete(taskId)
        }
    }
}

const compose = (...funcs) => {
    if(funcs.length === 0) {
        return (arg) => arg
    }

    if(funcs.length === 1) {
        return funcs[0]
    }

    const func = funcs.reduce((a, b) => (...args) => a(b(...args)))
    Object.assign(func, { _compose: true })
    return func
}

const asyncMemo = (p) => {
    let res = null, complete = false

    const pro = new Promise(async (resolve, reject) => {
        try {
            if (p == null) {
                resolve(undefined)
            } else {
                res = await p
                resolve(res)
            }
        } catch (err) {
            res = err
            reject(err)
        } finally {
            complete = true
        }
    })

    return () => {
        if (complete) {
            return Promise.resolve(res)
        } else {
            return pro
        }
    }
}


function getMax(arr) {
    let max = arr[0]
    for (let i = 1; i < arr.length; i++) {
        if (max < arr[i]) {
            max = arr[i]
        }
    }
    return max
}

module.exports = {
    isNil,
    TaskPool,
    compose,
    asyncMemo,
    getMax,
}