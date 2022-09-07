function formatDate(date, format) {
    const map = {
        mm: date.getMonth() + 1,
        dd: date.getDate(),
        yy: date.getFullYear().toString().slice(-2),
        yyyy: date.getFullYear(),
        hh: date.getHours(),
        ii: date.getMinutes(),
        ss: date.getSeconds(),
    };

    return format.replace(/mm|dd|yyyy|yy|hh|ii|ss/gi, (matched) => map[matched]);
}
module.exports = formatDate;
