// plugin/pages/login/login.js
import { regeneratorRuntime, initSentry } from '../../lib-别改里面代码/index' // eslint-disable-line
import { cache } from '../../lib-别改里面代码/index' // eslint-disable-line
import { request } from '../../utils/request'
import { api, errCode } from '../../config/api'
import { ErrorMessage, showError } from '../../lib-别改里面代码/lib/error'

const err = errCode.validateLoginState
Page({
    oauthData: '', // 传入的Oauth相关数据
    /**
     * 页面的初始数据
     */
    data: {
        account: '',
        password: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取Oauth相关参数
        this.oauthData = options.data
        this.clearStorage()
    },
    /**
     * 清除缓存
     */
    clearStorage() {
        cache.remove('OauthSession')
        cache.remove('authorization_code')
    },
    /** JSON.parse(
     * 获取账号密码
     * @param e
     */
    bindInput(e) {
        this.setData({
            [e.currentTarget.dataset.key]: e.detail.value
        })
    },
    /**
     * 账号密码登陆获取登陆接口cookie
     * @returns {Promise<void>}
     */
    login: async function () {
        let res
        if (!(this.data.account && this.data.password)) {
            await showError('账号密码不能为空')
        } else {
            try {
                res = await this._login()
                await this._getLoginSession(res)
            } catch (e) {
                await showError(e.message)
            }
        }
    },
    /**
     *登陆请求
     * @returns {Promise<*>}
     * @private
     */
    async _login() {
        let res
        try {
            res = await request({
                url: api.login,
                data: {
                    'account': this.data.account,
                    'password': this.data.password
                },
                method: 'POST'
            })
        } catch (e) {
            throw new ErrorMessage(`Oauth请求失败，网络错误${e}`)
        }
        // 判断返回数据是否成功
        switch (res.data.code) {
            case '0':
                break
            case err.wrongAccount.code: {
                throw new ErrorMessage(err.wrongAccount.msg, err.wrongAccount.code, {
                    needReport: false
                })
            }
            case err.wrongParameter.code: {
                throw new ErrorMessage(err.wrongParameter.msg, err.wrongParameter.code)
            }
            default:
                throw new ErrorMessage('登陆返回数据有误', res.data.code)
        }
        return res
    },
    /**
     * 获取登陆cookie
     * @param res
     * @returns {Promise<void>}
     * @private
     */
    async _getLoginSession(res) {
        let that = this
        let name
        let value
        try {
            // 切割响应头部cookie并存储
            [name, value] = res.header['set-cookie'].split(';')[0].split('=')
        } catch (e) {
            throw new ErrorMessage(`OauthSession解析异常，${e}`)
        }
        if (name && value) {
            console.log('login success')
            wx.showToast({
                title: '',
                icon: 'success',
                success: function () {
                    // 时效性，全局变量不持久，授权不需要这么久
                    wx.setStorageSync('OauthSession', {
                        oauthSessionKey: name,
                        oauthSessionValue: value
                    })
                    wx.redirectTo({ url: 'plugin-private://wxc44210f342bb2758/pages/authorize/authorize?data=' + that.oauthData })
                }
            })
        } else {
            throw new ErrorMessage(`OauthSession获取异常`)
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
