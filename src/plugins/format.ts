// 导入dayjs用于格式化时间
const dayjs = require('dayjs')


export const format = {
    dateFormat: (date: string|null): string|null => {
        if(date){
            return dayjs(date).format('YYYY-MM-DD')
        }
        return null
    },
    timeFormat: (time: string|null): string|null => {
        if(time){
            return dayjs(time).format('HH:mm:ss')
        }
        return null
    },
    dateTimeFormat: (dateTime: string|null): string|null => {
        if(dateTime){
            return dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss')
        }
        return null
    }
}

