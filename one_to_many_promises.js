
function apiRefreshToken() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const token = (new Date()).toISOString()
            console.log('apiRefreshToken:', token)
            resolve(token)
        }, 200)
    })
}

let refreshingToken = false
const refreshTokenQueue = []
function refreshToken() {
    if (!refreshingToken) {
        refreshingToken = true
        const token = apiRefreshToken().then(token => {
            refreshTokenQueue.forEach(q => {
                q.resolve(token)
            })
        }).catch(reason => {
            refreshTokenQueue.forEach(q => {
                q.reject(reason)
            })
        }).finally(() => {
            refreshingToken = false
        })
    }

    return new Promise((resolve, reject) => {
        refreshTokenQueue.push({ resolve, reject })
    })
}


function testRefreshToken() {
    for (let i = 0; i < 4; ++i) {
        console.warn(`request for refreshToken #${i}`)
        refreshToken().then(token => {
            console.warn('testRefreshToken:', token)
        })
    }
}
testRefreshToken()
