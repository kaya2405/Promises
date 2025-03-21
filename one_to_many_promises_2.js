async function apiRefreshToken() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const token = (new Date()).toISOString()
            console.log('apiRefreshToken:', token)
            resolve(token)
        }, 200)
    })
}

let refreshingToken = false
const refreshTokenQueue = []

async function refreshToken() {
    if (!refreshingToken) {
        refreshingToken = true
        try {
            const token = await apiRefreshToken()
            refreshTokenQueue.forEach(q => q.resolve(token))
        } catch (error) {
            refreshTokenQueue.forEach(q => q.reject(error))
        } finally {
            refreshingToken = false
        }
    }

    return new Promise((resolve, reject) => {
        refreshTokenQueue.push({ resolve, reject })
    })
}

async function testRefreshToken() {
    for (let i = 0; i < 4; ++i) {
        console.warn(`request for refreshToken #${i}`)
        const token = await refreshToken()
        console.warn('testRefreshToken:', token)
    }
}

testRefreshToken()
