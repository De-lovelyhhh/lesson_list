// 全局常量
const constant = {
    production: 'production',
    development: 'development',
}

// 存放Cache key 的map
const cacheKeyMap = {
    loginState: Symbol('login_key')
}

export { constant, cacheKeyMap }
