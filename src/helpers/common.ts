export function formatDateToYYYYMMDD(dateObject: any) {
    if(!dateObject) return ''
    const year = dateObject.$y
    const month = (dateObject.$M + 1).toString().padStart(2, '0')
    const day = dateObject.$D.toString().padStart(2, '0')
    const formattedDate: string = `${year}${month}${day}`
    return formattedDate
}