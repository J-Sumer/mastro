export const calculateDate = (date) => {
    var currentDateFull = new Date()
    var listDateFull = new Date(date)

    if (!date) return undefined

    const [currentMinutes, currentHours, currentDate, currentMonth, currentYear] = [currentDateFull.getMinutes(), currentDateFull.getHours(), currentDateFull.getDate(), currentDateFull.getMonth(), currentDateFull.getFullYear()]
    const [listMinutes, listHours, listDate, listMonth, listYear] = [listDateFull.getMinutes(), listDateFull.getHours(), listDateFull.getDate(), listDateFull.getMonth(), listDateFull.getFullYear()]
    const yearDiff = currentYear - listYear;
    if (yearDiff > 0) {
        return yearDiff === 1 ? `1 year ago` : `${yearDiff} years ago`
    }
    const monthDiff = currentMonth - listMonth;
    if (monthDiff > 0) {
        return monthDiff === 1 ? `1 month ago` : `${monthDiff} months ago`
    }
    const dayDiff = currentDate - listDate;
    if (dayDiff > 0) {
        return dayDiff === 1 ? `1 day ago` : `${dayDiff} days ago`
    }
    const hourDiff = currentHours - listHours;
    if (hourDiff > 0) {
        return hourDiff === 1 ? '1 hour ago' : `${hourDiff} hours ago`
    }
    const minuteDiff = currentMinutes - listMinutes
    if (minuteDiff > 0) {
        return minuteDiff === 1 ? '1 minute ago' : `${minuteDiff} minutes ago`
    }
    return `1 minute ago`
}