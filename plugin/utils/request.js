import { regeneratorRuntime } from '../lib-别改里面代码/index' // eslint-disable-line
import { wxRequest } from '../lib-别改里面代码/lib/wxApi'
import { throwError } from '../lib-别改里面代码/lib/error'

const Raven = require('../lib-别改里面代码/third-party/raven')

const request = async function (_options) {
    let beginTime = Date.now()
    if (_options.showLoading) {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
    }
    _options.data['r_time'] = new Date().getTime()
    let res
    try {
        res = await wxRequest(_options)
    } catch (e) {
        wx.hideLoading()
        throwError(`发送请求出错 ${e.message || e.errMsg}`)
    }

    // sentry 埋点
    Raven.captureBreadcrumb({
        category: 'ajax',
        data: {
            method: _options.method,
            url: _options.url,
            options: _options
        }
    })

    console.log(`url: ${_options.url} time: ${Date.now() - beginTime}ms`, res)
    wx.hideLoading()
    return res
}

export { request }