const oauthHost = 'http://139.199.224.230:7001'

const api = {
    login: oauthHost + '/oauth/login',  // 汕头大学账号账号密码验证
    authorize: oauthHost + '/oauth/authorize',   // 课程表Oauth授权
}

const errCode = {
    validateLoginState: {
        no_skey: '01030101',
        not_find_session: '01030102',
        invalid_skey: '01030103',
        wrongAccount: {
            code: '01200102',
            msg: '账号或密码错误'
        },
        wrongParameter: {
            code: '01100101',
            msg: '传参有误（参数类型不匹配）'
        },
        wrongAuthCode: {
            code: '01200103',
            msg: '返回授权码出错'
        }
    }
}

export { api, errCode }
