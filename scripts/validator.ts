// =======================================================
export function validateHWCDate(hwcDatesArray: string[]) {
  // Validate that the list of HWC Dates generated for a sequence
  // of Hijri Dates is correct in accordance with the following rules:
  //
  //  1. The weekdays must be consecutive and are in the range 1 to 7.
  //  2. No weekday above 7 or below 1.
  //  3. Weekday 7 is followed by weekday 1.
  //  4. Weekday 1 occurs at the start of a new week.
  //  5. The consecutive weekdays 1 to 7 are associated with the same week number.
  //
  //  6. Weeks are consecutive and are in the range of 1 to 50 or 51.
  //  7. No week is above 51 or below 1.
  //  8. Week 01 occurs at the start of a new year.
  //  9. Week 01 follows the end of week 50 or 51.
  // 10. Week 50 is followed by week 51 or week 01.
  // 11. Week 51 is followed by week 1.

  // 12. Year must start with Week 01.
  // 13. Year must start with weekday No. 1.
  // 14. Year must end with Week 50 or 51.
  // 15. Year must end with weekday No. 7.
  //
  // 16. Week 01 has 4th Muharram in it.
  // 17. 4th Muharram falls in Week 01.
  //
  // 18. A Common Hijri Year that starts on Sat, Sun, Mon, or Tue (days 1, 2, 3, or 4) must
  //     have 51 weeks in the corresponding Hijri-Week Year.
  // 19. A common Hijri year that starts on Wed, Thu, or Fri (days 5, 6, or 7) must
  //     have 50 weeks in the corresponding Hijri-Week Year.
  // 20. A leap Hijri Year that starts on Sat, Sun, Mon, Tue, or Fri (days 1, 2, 3, 4, or 7)
  //     must has 51 weeks in the corresponding Hijri-Week Year.
  // 21. A leap Hijri year that starts on Wed or Thu (days 5 or 6) must have 50 weeks
  //     in the corresponding Hijri-Week Year.

  let [thisYear, thisWeek, thisDay] = decodeHWCDate(hwcDatesArray[1]) // first hwc date in list
  let [thisHYear, thisHMonth, thisHDay] = decodeHijriDate(hwcDatesArray[0]) // first Hijri date in list
  let error = false // error tracker
  // Check The weekday of the Hijri year Start Date and the Total HWC Weeks match
  error = checkStartDate(hwcDatesArray, thisHYear, thisHMonth, thisHDay, thisYear, thisWeek, thisDay)

  let daysCount = thisDay
  let weekArray = [] // holds week numbers for the weekdays 1-7
  const allEqual = (list: number[]) => list.every(i => i === list[0])
  const listSize = hwcDatesArray.length

  //
  // ========= Start Looping thru Dates' Array =======
  //
  for (let i = 2; i < listSize; i += 2) {
    const hDate = hwcDatesArray[i] // get an Hijri date from array
    const hwcDate = hwcDatesArray[i + 1] // get an HWC date from array

    const [nextYear, nextWeek, nextDay] = decodeHWCDate(hwcDate) // decode HWC Date into y, w, d
    const [nextHYear, nextHMonth, nextHDay] = decodeHijriDate(hDate) // decode Hijri Date into y, w, d

    if (nextDay > 7 || nextDay < 1) { // weekdays from 1 to 7
      console.log(`❌ Failed. Incorrect weekday in year ${nextYear}, week ${nextWeek}. Weekday ${nextDay} invalid`)
      error = true
    }
    if (nextWeek > 51 || nextWeek < 1) { // weeks from 1 to 50/51
      console.log(`❌ Failed. Incorrect Week in year ${nextYear}. Week No. ${nextWeek} invalid`)
      error = true
    }
    // ----------- Validate at Change of Hijri Years --------
    if (nextHYear !== thisHYear) { // a new Hijri year has started
      // Check The weekday of the Hijri year Start Date and the Total HWC Weeks match
      error = checkStartDate(hwcDatesArray, nextHYear, nextHMonth, nextHDay, nextYear, nextWeek, nextDay)
    }
    // ----------- Validate at Change of HWC Years --------
    if (nextYear !== thisYear) { // a new HWC year has started
      if ((nextYear - thisYear) !== 1) { // year not in sequence
        console.log(`❌ Failed. Year not in sequence..${nextYear} after ${thisYear}`)
        error = true
      }
      if (nextWeek !== 1) { // next week must be 1
        console.log(`❌ Failed. Year ${nextYear} started with non-Week 01! Year started with week number ${nextWeek}`)
        error = true
      }
      if (!(thisWeek === 50 || thisWeek === 51)) { // previous week for ending HWC year must be 50 or 51
        console.log(`❌ Failed. Year ${thisYear} ended with non-Week 50/51! Year ended with week number ${thisWeek}`)
        error = true
      }
      if (nextDay !== 1) { // Start HWC year's weekday must be 1
        console.log(`❌ Failed. Year ${nextYear} started with non-weekday 1! Year started with weekday ${nextDay}`)
        error = true
      }
      if (thisDay !== 7) { // Ending HWC year's weekday must end with 7
        console.log(`❌ Failed. Year ${thisYear} ended with non-weekday 7! Year ended with weekday ${thisDay}`)
        error = true
      }
      // with a new HWC year check that Week 01 has 4th Muharram
      if (nextWeek === 1) {
        let muharram4 = false
        for (let m = 0; m < 13; m += 2) {
          if ((i + m) >= listSize || (hwcDatesArray[i + m].slice(-4) === '0104')) {
            muharram4 = true
            break
          }
        }
        if (!muharram4) {
          console.log(`❌ Failed. 4th Muharram for year ${nextYear} does not fall in Week 01`)
          error = true
        }
      }
    }

    // ----------- Validate at Change of HWC Weeks --------
    if (nextWeek !== thisWeek) { // a new week has started
      if (thisWeek === 51 && nextWeek !== 1) {
        console.log(`❌ Failed. Week 51 is not followed by Week 01 in year ${nextYear}`)
        error = true
      }
      if (nextWeek === 1) { // if next week is Week 01
        if (!(thisWeek === 50 || thisWeek === 51)) { // then previous week must be 50 or 51
          console.log(`❌ Failed. Week not in sequence in year ${nextYear}. Week 01 after Week ${thisWeek}`)
          error = true
        }
      }
      else if ((nextWeek - thisWeek) !== 1) { // weeks must be in sequence
        console.log(`❌ Failed. Week not in sequence in year ${nextYear}. Week ${nextWeek} after Week ${thisWeek}`)
        error = true
      }
    }

    // ----------- Validate at Change of HWC weekdays --------
    if (nextDay !== thisDay) { // a new weekday has started
      if (nextDay === 1) { // this week ended, must have 7 weekdays count so far
        weekArray = [] // flush the weeks array list
        if (daysCount !== 7) {
          console.log(`❌ Failed. Week has less than 7 weekdays found in year ${nextYear}, week ${nextWeek}. At weekday ${nextDay}`)
          error = true
        }
      }

      if (nextDay === 1) { // if next weekday is weekday 1
        if (thisDay !== 7) { // then previous weekday must be 7
          console.log(`❌ Failed. Weekday not in sequence in year ${nextYear}. Weekday 1 after weekday ${thisDay}`)
          error = true
        }
      }
      else if ((nextDay - thisDay) !== 1) { // weekdays must be in sequence
        console.log(`❌ Failed. Weekday not in sequence in year ${nextYear}, week ${nextWeek}. Weekday ${nextDay} found after weekday ${thisDay}`)
        error = true
      }
      // weekdays are now Good
      daysCount++ // increment weekday count
      weekArray.push(nextWeek) // remember the week no. for the weekday

      // check that all weekdays fall in the same Week
      if (!allEqual(weekArray)) {
        console.log(`❌ Failed. Weekday with incorrect Week in year ${nextYear}, week ${nextWeek}, weekday ${nextDay}`)
        error = true
      }

    // else we have duplicate weekdays
    }
    else {
      console.log(`❌ Failed. Weekday duplicate in year ${nextYear}, week ${nextWeek}, weekday ${nextDay}.`)
      error = true
    }

    // so far all is ok
    thisYear = nextYear // update year number
    thisHYear = nextHYear // update year number
    thisWeek = nextWeek // update week number
    thisDay = nextDay // update weekday number
    if (thisDay === 1)
      daysCount = 1 // reset weekday count to 1
  } // loop again for the next HWC date

  // all dates done.....
  console.log(error ? '❌ Failed...' : '✅ All tests Passed...')
}

// =======================================================
function checkStartDate(hwcDatesArray: string[], thisHYear: number, thisHMonth: number, thisHDay: number, thisYear: number, thisWeek: number, thisDay: number) {
  let error = false
  let lastWeekPivot = '1227'
  const hStartIndex = hwcDatesArray.indexOf(`${thisHYear}0101`)
  let hEndIndex = hwcDatesArray.indexOf(`${thisHYear}1230`)
  if (hEndIndex < 0) {
    hEndIndex = hwcDatesArray.indexOf(`${thisHYear}1229`)
    lastWeekPivot = '1226'
  }

  const hYearSize = (hEndIndex - hStartIndex + 2) / 2 // get the length of Hijri Year

  if ((hYearSize > 355) || (hYearSize < 354)) {
    console.log(`❌ Failed. The Hijri year ${thisHYear} is ${hYearSize} days. That is not possible. This is an error or bug in the original Hijri Date and not in the HWC system.`)
    error = true
  }

  const hLeap = (hYearSize === 355)
  const indexPivotDay = hwcDatesArray.indexOf(thisHYear + lastWeekPivot) // get date on 26/12 or 27/12
  const hwcPivot = hwcDatesArray[indexPivotDay + 1]
  const [_xy, totalWeeks] = decodeHWCDate(hwcPivot) // get total week for corresponding HWC Year
  const dayName = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  if (hLeap) {
    if ([1, 2, 3, 4, 7].includes(thisDay) && totalWeeks !== 51) {
      console.log(`❌ Failed. The Hijri leap year ${thisHYear} starts on ${dayName[thisDay]} but the total HWC weeks is 50. ${thisHYear} must have a total of 51 weeks.`)
      error = true
    }
    if ([5, 6].includes(thisDay) && totalWeeks !== 50) {
      console.log(`❌ Failed. The Hijri leap year ${thisHYear} starts on ${dayName[thisDay]} but the total HWC weeks is 51. ${thisHYear} must have a total of 50 weeks.`)
      error = true
    }
  }
  else { // common year
    if ([1, 2, 3, 4].includes(thisDay) && totalWeeks !== 51) {
      console.log(`❌ Failed. The Hijri common year ${thisHYear} starts on ${dayName[thisDay]} but the total HWC weeks is 50. ${thisHYear} must have a total of 51 weeks.`)
      error = true
    }
    if ([5, 6, 7].includes(thisDay) && totalWeeks !== 50) {
      console.log(`❌ Failed. The Hijri leap year ${thisHYear} starts on ${dayName[thisDay]} but the total HWC weeks is 51. ${thisHYear} must have a total of 50 weeks.`)
      error = true
    }
  }
  return error
}
// =======================================================
function decodeHWCDate(hwcDate: string) {
// convert the HWC Date to [year, week, day]
  const hwcDateParts = hwcDate.split('W')
  return [+hwcDateParts[0], +hwcDateParts[1].slice(0, 2), +hwcDateParts[1].slice(2, 3)]
}
// =======================================================
function decodeHijriDate(hDate: string) {
// convert the Hijri compact Date to [year, month, day]
  const md = hDate.slice(-4)
  const hy = hDate.slice(0, hDate.length - md.length)
  return [+hy, +md.slice(0, 2), +md.slice(2, 4)]
}
