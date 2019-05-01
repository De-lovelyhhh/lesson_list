// index1.js
// 获取应用实例
import regeneratorRuntime from '../../utils/third-party/runtime' // eslint-disable-line
let util = require('../../utils/util.js')
import { request } from '../../utils/lib/request'

// noinspection JSAnnotator
Page({
    data: {
        dayList: [],
        classList: [[], [], [], [], [], [], []],
        isEmpty: true
    },
    async onLoad(format, data) {
        this.showPerSchedule()
        let time = new Date()
        let weekday = time.getDay()
        let thisweek = util.getDates(7)
        let that = this
        let week = await this.getDay()
        this.setData({
            week,
            weekday: weekday,
            dayList: thisweek
        })
        wx.setNavigationBarTitle({ title: '第' + week + '周' })
        this.setData({
            classList: await this.getClass()
        })
        this.data.classList[this.data.weekday].forEach(function(value) {
            if (value.classWeek[21 - week] === '1') {
                that.setData({ isEmpty: false })
            }
        })
    },

    async getDay() {
        let res = await request({
            url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/weekNum'
        })
        return res.data.Today.week
        /* return new Promise(function (resolve, reject) {
            wx.request({
                url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/weekNum',
                success: function(res) {
                    console.log(res)
                    resolve(res.data.Today.week)
                },
                fail: function (e) {
                    console.log(e)
                }
            })
        }) */
    },

    async getClass() {
        let that = this
        let res = await request({
            url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/class_schedule',
            method: 'POST'
        })
        let classList = [[], [], [], [], [], [], []]
        console.log(res)
        // todo 判断class是不是空的
        res.data.class.forEach(classlist => {
            classlist.schedules.forEach(schedules => {
                let beginTime = schedules.beginTime.tofix(2).toString()
                let endTime = schedules.endTime.tofix(2).toString()
                let begin = beginTime.split('.')
                let end = endTime.split('.')
                // 将时间转换成二进制
                let week = that.toBin(schedules.week)
                let plan = {
                    lessonName: classlist.name,
                    lessonId: classlist.id,
                    lessonTeacher: classlist.teacher,
                    lessonCredit: classlist.credit,
                    lessonTime: schedules.time,
                    lessonBeginFloat: schedules.beginTime,
                    lessonEndFloat: schedules.endTime,
                    lessonBeginTime: begin[0] + ':' + begin[1],
                    lessonEndTime: end[0] + ':' + end[1],
                    lessonRoom: schedules.room,
                    lessonWeek: week
                }
                classList[schedules.day].push(plan)
            })
        })
        // 按时间先后排序
        for (let i = 0; i < 7; i++) {
            classList[i].sort('lessonBeginFloat')
        }
        console.log(classList)
        that.setData({
            classList: classList
        })
        wx.setStorageSync('classList', that.data.classList)
        return that.data.classList
        /* return new Promise(function(resolve, reject) {
            wx.request({
                url: 'https://www.easy-mock.com/mock/5c95ecbf8e241c358386bc37/class_schedule',
                method: 'POST',
                success: function (res) {
                    let classList = [[], [], [], [], [], [], []]
                    console.log(res)
                    res.data.class.forEach(classlist => {
                        classlist.schedules.forEach(schedules => {
                            let beginTime = schedules.beginTime.tofix(2).toString()
                            let endTime = schedules.endTime.tofix(2).toString()
                            let begin = beginTime.split('.')
                            let end = endTime.split('.')
                            // 将时间转换成二进制
                            let week = that.toBin(schedules.week)
                            let plan = {
                                lessonName: classlist.name,
                                lessonId: classlist.id,
                                lessonTeacher: classlist.teacher,
                                lessonCredit: classlist.credit,
                                lessonTime: schedules.time,
                                lessonBeginFloat: schedules.beginTime,
                                lessonEndFloat: schedules.endTime,
                                lessonBeginTime: begin[0] + ':' + begin[1],
                                lessonEndTime: end[0] + ':' + end[1],
                                lessonRoom: schedules.room,
                                lessonWeek: week
                            }
                            classList[schedules.day].push(plan)
                        })
                    })
                    // 按时间先后排序
                    for (let i = 0; i < 7; i++) {
                        classList[i].sort('lessonBeginFloat')
                    }
                    console.log(classList)
                    that.setData({
                        classList: classList
                    })
                    wx.setStorageSync('classList', that.data.classList)
                    resolve(that.data.classList)
                },
                fail: function (e) {
                    console.log('请求失败：' + e)
                    reject(e)
                }
            })
        }) */

    },
    showPerSchedule: function() {
        let classList = wx.getStorageSync('classList')
        if (classList) {
            this.setData({
                classList: classList
            })
        }
    },
    changeDay: function (options) {
        let day = options.currentTarget.dataset.index
        let week = this.data.week
        this.setData({ isEmpty: true })
        let that = this
        this.setData({
            weekday: day
        })
        this.data.classList[day].forEach(function(value) {
            if (value.classWeek[21 - week] === '1') {
                that.setData({ isEmpty: false })
            }
        })
    },
    toBin: function (n) {
        if (n === 0) return '00000000000000000000'
        return n.toString(2).padStart(20, '0')
    }
})
