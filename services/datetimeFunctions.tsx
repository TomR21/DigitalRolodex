
/** Calculayes the numbers of days between either a date and today or two different dates. 
 * Does not account for the differences in years */
export function findDaysDifference(dateString1: string, dateString2?: string): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const currYear = new Date().getFullYear()

  const [day, month, _] = dateString1.split('-');
  const datesep1 = new Date(currYear, +month-1, +day+1)
  const date1 = datesep1.valueOf()
  
  if ( dateString2 ) {
    const [day, month, _] = dateString2!.split('-');
    const date2 = new Date(currYear, +month-1, +day).valueOf()

    return Math.round((date1 - date2) / millisecondsPerDay);
  } else {

    const date2 = Date.now()

    return Math.round((date1 - date2) / millisecondsPerDay);
  }
}