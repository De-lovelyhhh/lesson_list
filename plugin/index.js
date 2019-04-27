function getCode() {
    return wx.getStorageSync('authorization_code')
}

import { initSentry } from 'lib-别改里面代码/index'

initSentry()

module.exports = {
    getCode
}
