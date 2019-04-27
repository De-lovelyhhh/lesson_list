/**
 * @author 小糖
 * @date 2019/4/7
 * @Description: 插件配置文件
*/
// 开发时把环境修改成development，以免把开发中的bug记录
const environment = 'production'
// const environment = 'development'
const release = '1.0.0'

let config = {
    environment,
    release,
    app_id: 'wxc44210f342bb2758',
    sentry: {
        dsn: 'https://a1bb5f3cec8d4278b8019e673334ef9b@sentry.io/1432929',
        options: {
            environment,
            release,
            allowDuplicates: true, // 允许相同错误重复上报
            sampleRate: 0.5 // 采样率
        }
    }
}

export default config
