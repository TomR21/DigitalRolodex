
/** Calculates the numbers of days between either a date and today or two different dates. 
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

    return Math.round((date2 - date1) / millisecondsPerDay);

  } else {

    const date2 = Date.now()

    return Math.round((date2 - date1) / millisecondsPerDay);
  }
}

/** Calculates the numbers of years between input date and date of today */
export function findYearsDifference(date: string): number {

  // Get birthyear from entered date
  const birthdayArray = date.split("-") 
  const birthyear = birthdayArray[2]

  // Get current year, month and day
  const currDate = new Date()   // Date format: Mon 30 12 1991 23:55:14 GMT+0200
  const currYear = currDate.getFullYear()
  const currMonth = currDate.getMonth() + 1    // months are counted from 0
  const currDay = currDate.getDate() 
  
  // Calculate age difference between today and birth and assume birthday has not yet taken place
  var age = currYear - Number(birthyear) - 1
  
  // Add 1 to age if day of birth has already taken place this year
  if (Number(birthdayArray[1]) < currMonth) {age++} 
  if ((Number(birthdayArray[1]) == currMonth) && (Number(birthdayArray[0]) <= currDay)) {age++} 

  return age
  
}