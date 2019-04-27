// plugin/pages/authorize/authorize.js
import { regeneratorRuntime, initSentry } from '../../lib-别改里面代码/index' // eslint-disable-line
import { api, errCode } from '../../config/api'
import { showError, ErrorMessage } from '../../lib-别改里面代码/lib/error'
import { request } from '../../utils/request'

const err = errCode.validateLoginState
Page({
    oauthData: '',

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.oauthData = JSON.parse(decodeURIComponent(options.data))
    },
    /**
     * 授权函数，获取授权码
     * @returns {Promise<void>}
     */
    getCode: async function () {
        // 从本地缓存获取OauthSession
        let oauthSession = wx.getStorageSync('OauthSession')
        if (!oauthSession) {
            throw new ErrorMessage(`获取本地OauthSession失败：${oauthSession}`)
        }
        else {
            let res
            try {
                res = await request({
                    url: api.authorize,
                    data: {
                        'response_type': 'code',
                        'client_id': this.oauthData.client_id,
                        'state': this.oauthData.state,
                        'scope': this.oauthData.scope,
                        'from': 'mini'
                    },
                    header: { cookie: `${oauthSession.oauthSessionKey}=${oauthSession.oauthSessionValue}` }
                })
            } catch (e) {
                throw new ErrorMessage(`获取授权码code请求失败${e}`)
            }
            // 判断返回的数据是否正确
            switch (res.data.code) {
                case '0': {
                    return res.data
                }
                case err.wrongParameter.code: {
                    throw new ErrorMessage(err.wrongParameter.msg, err.wrongParameter.code)
                }
                case err.wrongAuthCode.code: {
                    throw new ErrorMessage(err.wrongAuthCode.msg, err.wrongAuthCode.code)
                }
                default:
                    throw new ErrorMessage('授权返回数据失败,错误码', res.data.code)
            }
        }
    },
    /**
     * 授权交互函数
     * @returns {Promise<void>}
     */
    authorize: async function () {
        try {
            let res = await this.getCode()
            if (res) {
                wx.showToast({
                    title: '',
                    icon: 'success',
                    success: function () {
                        // 存储授权码到本地并返回到小程序
                        wx.setStorageSync('authorization_code', res.authorization_code)
                        wx.navigateBack({ delta: 1 })
                    }
                })
            } else {
                await showError('授权失败')
            }
        } catch (e) {
            await showError('授权失败')
        }
    }
})

