import regeneratorRuntime from '../../utils/third-party/runtime' // eslint-disable-line
import { wxRequest } from '../../utils/lib/wxApi'
import { throwError } from '../../utils/lib/error'
// todo 接入框架
Page({
    lessonData: '',
    curWeek: '',
    data: {
        week: ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        times: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C']
    },
    /**
     * 获取本地缓存中的周期课表
     * @returns {Promise<void>}
     */
    onLoad: async function () {
        let that = this
        let weeklyLesson = wx.getStorageSync('weeklyLesson')
        if (weeklyLesson) {
            that.curWeek = weeklyLesson.curWeek
            that.lessonData = weeklyLesson.lessons
            await this.showClass()
            let setLessons = await that.getLessons()
            wx.setStorage({
                key: 'weeklyLesson',
                data: {
                    lessons: setLessons.lessons,
                    curWeek: setLessons.curWeek
                }
            })
        } else {
            let setLessons = await that.getLessons()
            wx.setStorage({
                key: 'weeklyLesson',
                data: {
                    lessons: setLessons.lessons,
                    curWeek: setLessons.curWeek
                }
            })
            that.curWeek = setLessons.curWeek
            that.lessonData = setLessons.lessons
        }
    },
    /**
     * 请求获取课表数据和周期数
     * @returns {Promise<{curWeek: (string[]|*), lessons: string}>}
     */
    async getLessons() {
        let res
        let res2
        try {
            res = await wxRequest({
                url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/class_schedule',
                method: 'post',
            })
        } catch (e) {
            await throwError(`获取课表失败:${e}`)
        }
        try {
            res2 = await wxRequest({
                url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/weekNum',
            })
        } catch (e) {
            await throwError(`获取周数失败:${e}`)
        }
        if (res.data.code === '0' && res2.data.code === '0') {
            return {
                curWeek: res2.data.Today.week,
                lessons: res.data.class
            }
        } else {
            await throwError(`获取课表失败`)
        }
    },
    /**
     * 转换上课时间
     * @param timeStr
     * @returns {number}
     */
    transformClassTime(timeStr) {
        let top = Number(timeStr.charAt(0))
        if (!top) {
            switch (timeStr.charAt(0)) {
                case 'A':
                    top = 11
                    break
                case 'B':
                    top = 12
                    break
                case 'C':
                    top = 13
            }
        }
        if (top === 0) {
            top = 10
        }
        // console.log(top)
        return top
    },
    /**
     * 得到二进制周数
     * @param week
     * @returns {string[]}
     */
    checkWeek(week) {
        let that = this
        let str = week.toString(2).split('')
        if (that.curWeek) {
            return str[str.length - that.curWeek + 1] === '1'
        }
    },
    /**
     * 显示课表
     * @returns {Promise<void>}
     */
    async showClass() {
        let that = this
        let lesson = that.lessonData
        let timeTable = []
        lesson.forEach(item => {
            for (let j = 0; j < item.schedules.length; j++) {
                timeTable.push({
                    left: item.schedules[j].day,
                    top: that.transformClassTime(item.schedules[j].time),
                    height: item.schedules[j].time.length,
                    className: item.name,
                    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
                    room: item.schedules[j].room,
                    week: that.checkWeek(item.schedules[j].week),
                })
            }
        })
        that.setData({
            timeTable
        })
    }
})
