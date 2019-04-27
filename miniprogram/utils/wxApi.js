/**
 * @author 小糖
 * @date 2019/1/31
 * @Description:
 */

/**
 * 微信接口Promise化
 * @param {Function} fn
 */
const wxPromisify = function (fn) {
    return function (obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = function (res) {
                // 成功
                let time = new Date().getTime()
                console.log('url:', obj.url, 'time:', time, 'ms:', res)
                resolve(res)
            }
            obj.fail = function (res) {
                // 失败
                reject(res)
            }
            fn(obj)
        })
    }
}

const wxLogin = wxPromisify(wx.login)
const wxGetUserInfo = wxPromisify(wx.getUserInfo)
const wxRequest = wxPromisify(wx.request)
const wxShowModal = wxPromisify(wx.showModal)

export { wxPromisify, wxLogin, wxGetUserInfo, wxRequest, wxShowModal }
