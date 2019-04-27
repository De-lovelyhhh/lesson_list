const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// todo 命名
// todo 那天是几号用newdate
function getDates(days) {
    let dateArray = []
    let todate = new Date()
    let day = todate.getDay()
    let date = Date.now()
    console.log(day)
    day = date + 24 * 60 * 60 * 1000 * (-1 - (day + 6) % 7)
    for (let i = 0; i < days; i++) {
        let dateObj = dateLater(day)
        day = day + 24 * 60 * 60 * 1000
        dateArray.push(dateObj)
    }
    return dateArray
}
function dateLater(dates) {
    let dateObj = {}
    let show_day = [0, 1, 2, 3, 4, 5, 6]
    let date = new Date(dates)
    let day = date.getDay()
    let yearDate = date.getFullYear()
    let month = (date.getMonth() + 1)
    let dayFormate = date.getDate()
    dateObj.time = yearDate + '-' + month
    dateObj.day = dayFormate
    dateObj.week = show_day[day]
    return dateObj
}

module.exports = {
    formatTime: formatTime,
    getDates: getDates
}
