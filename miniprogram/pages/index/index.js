import regeneratorRuntime from '../../utils/third-party/runtime' // eslint-disable-line
import { wxRequest } from '../../utils/wxApi'
import { showError, throwError } from '../../utils/error'

const myPlugin = requirePlugin('myPlugin')

Page({
    OauthPage: false, // 页面隐藏
    oauthData: '', // 返回的Oauth相关数据
    skey: '',
    syllabusSession: '', // 接口cookie

    data: {
        info: ''
    },
    /**
     * Oauth查询认证，获取相关参数
     * @returns {Promise<{state: *, client_id: *, scope: *, redirect_uri: *}>}
     */
    async getOauthData() {
        let res
        try {
            res = await wxRequest({
                url: 'http://139.199.224.230:7002/user/get_oauth_data',
                data: { from: 'mini' }
            })
        } catch (e) {
            await throwError(`查询认证失败:${e}`)
        }
        switch (res.data.code) {
            case '0':
                break
            default:
                await throwError(`获取Oauth信息失败，错误码: ${res.data.code}`)
        }
        // todo 统一log
        try {
            let syllabusCookie = res.header['set-cookie'].split(';')[0]
            let name = syllabusCookie.split(';')[0].split('=')[0]
            let value = syllabusCookie.split(';')[0].split('=')[1]
            if (name && value) {
                this.syllabusSession = { name, value }
                console.log('getOauthData success')
            }
            else {
                await throwError(`syllabusCookie获取异常，cookie：${syllabusCookie}`)
            }
        } catch (e) {
            await throwError(`syllabusCookie获取异常${e}`)
        }
        return {
            state: res.data.state,
            client_id: res.data.client_id,
            scope: res.data.scope,
            redirect_uri: res.data.redirect_uri
        }
    },
    /**
     * 重定向url 获得skey
     * @param code
     * @param redirect_uri
     * @param state
     * @returns {Promise<{skey: string, refresh_key: *}>}
     */
    async getSkey(code, redirect_uri, state) {
        let res
        try {
            res = await wxRequest({
                url: redirect_uri,
                method: 'GET',
                data: { code: code, state: state, from: 'mini' },
                header: { cookie: `${this.syllabusSession.name}=${this.syllabusSession.value}` },
            })
        } catch (e) {
            throwError(`获取skey失败：${e}`)
        }
        if (res.data.code === '0') {
            return { skey: res.data.skey, refresh_key: res.data.refresh_key }
        }
        else {
            await throwError('获取skey失败', res.data.code)
        }
    },
    /**
     * 跳转到登陆插件
     * @returns {Promise<void>}
     * @constructor
     */
    Stulogin: async function () {
        try {
            let res = await this.getOauthData()
            if (res) {
                this.oauthData = res
                this.OauthPage = true
                wx.navigateTo({
                    url: 'plugin-private://wxc44210f342bb2758/pages/login/login?data=' + encodeURIComponent(JSON.stringify(res)),
                })
            } else {
                await throwError(`获取Oauth数据失败:${res}`)
            }
        } catch (e) {
            await showError('查询认证失败')
        }
    },
    /**
     * 获取code，换skey
     * @returns {Promise<void>}
     */
    onShow: async function () {
        // 判断是否是页面切换
        if (this.OauthPage) {
            this.OauthPage = false
            let code = myPlugin.getCode()
            if (!code) {
                console.log('授权失败,返回的code:', code)
                await showError('授权失败')
            } else {
                let skey = await this.getSkey(code, this.oauthData.redirect_uri, this.oauthData.state)
                console.log('skey:', skey)
                if (skey.skey) {
                    this.skey = skey
                } else {
                    console.log('skey获取失败', skey.skey)
                    await showError('授权失败')
                }
            }
        }
    },
    /**
     * 获取用户信息
     * @returns {Promise<void>}
     */
    async getInfo() {
        if (!this.skey.skey) {
            await showError('请先登陆')
        } else {
            let res
            try {
                res = await wxRequest({
                    url: 'http://139.199.224.230:7002/user/info',
                    method: 'POST',
                    header: { skey: this.skey.skey }
                })
            } catch (e) {
                await showError('获取用户信息失败')
                console.log('获取用户信息失败：', e)
            }
            if (res.data.code === '0') {
                console.log('user_info', res.data.user_info)
                this.setData({ info: res.data.user_info })
                wx.navigateTo({
                    url: '../dayline/index1'
                })
            }
            else {
                await showError('获取用户信息失败')
            }
        }
    }
})
