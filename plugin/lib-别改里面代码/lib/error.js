import { wxShowModal } from './wxApi'
import regeneratorRuntime from '../third-party/runtime' // eslint-disable-line

let Raven = require('../third-party/raven')

/**
 * 自定义错误信息类
 */
class ErrorMessage {
    constructor(msg, code, options) {
        const error = new Error(msg)
        let option = options
        if (typeof code === 'string') {
            error.message += `\t错误码: ${code}`
        } else {
            option = code
        }
        console.error(error)
        if (!option || !option.needReport) {
            Raven.captureException(msg, {
                level: 'error'
            })
        }
        return error
    }
}

/**
 * 通用错误弹窗
 * @param options
 */
const showError = async function (options) {
    let optionObj
    if (typeof options === 'string') {
        optionObj = {
            content: options
        }
    } else {
        optionObj = options
    }
    let _options = Object.assign({
        title: '提示',
        showCancel: false,
        content: '系统繁忙，请稍后再来'
    }, optionObj)
    await wxShowModal(_options)
}

export { showError, ErrorMessage }
export default { showError, ErrorMessage }

