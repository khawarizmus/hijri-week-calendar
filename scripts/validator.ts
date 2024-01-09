import kleur from 'kleur'
import ora from 'ora'
import type { Ora } from 'ora'
import { storage } from './store'

// =======================================================
export function validateDates(dates: number[][], spinner: Ora) {
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

  let [thisHYear, thisHMonth, thisHDay, thisYearOfWeek, thisWeekOfYear, thisDayOfWeek] = dates[0] // grab first Hijri date and first HWC date in the list
  // spinner.clear()
  // spinner.text = `Validating dates for year ${kleur.yellow(`AH ${thisHYear}`)}\n`
  // spinner.render()
  let error = false // error tracker
  // Check The weekday of the Hijri year Start Date and the Total HWC Weeks match
  error = checkStartDate(dates, thisHYear, thisHMonth, thisHDay, thisYearOfWeek, thisWeekOfYear, thisDayOfWeek, spinner)

  let daysCount = thisDayOfWeek
  let weekArray = [] // holds week numbers for the weekdays 1-7
  const allEqual = (list: number[]) => list.every(i => i === list[0])
  const listSize = dates.length

  //
  // ========= Start Looping thru Dates' Array =======
  //
  for (let i = 1; i < listSize; i++) {
    const [nextHYear, nextHMonth, nextHDay, nextYearOfWeek, nextWeekOfYear, nextDayOfWeek] = dates[i] // get next Hijri date and next HWC date in the list

    if (nextDayOfWeek > 7 || nextDayOfWeek < 1) { // weekdays from 1 to 7
      spinner.fail(`Incorrect weekday in year ${nextYearOfWeek}, week ${nextWeekOfYear}. Weekday ${nextDayOfWeek} invalid`)
      error = true
    }
    if (nextWeekOfYear > 51 || nextWeekOfYear < 1) { // weeks from 1 to 50/51
      spinner.fail(`Incorrect Week in year ${nextYearOfWeek}. Week No. ${nextWeekOfYear} invalid`)
      error = true
    }
    // ----------- Validate at Change of Hijri Years --------
    if (nextHYear !== thisHYear) { // a new Hijri year has started
      // spinner.clear()
      // spinner.text = `Validating dates for year ${kleur.yellow(`AH ${nextHYear}`)}\n`
      // spinner.render()
      // Check The weekday of the Hijri year Start Date and the Total HWC Weeks match
      error = checkStartDate(dates, nextHYear, nextHMonth, nextHDay, nextYearOfWeek, nextWeekOfYear, nextDayOfWeek, spinner)
    }
    // ----------- Validate at Change of HWC Years --------
    if (nextYearOfWeek !== thisYearOfWeek) { // a new HWC year has started
      if ((nextYearOfWeek - thisYearOfWeek) !== 1) { // year not in sequence
        spinner.fail(`Year not in sequence..${nextYearOfWeek} after ${thisYearOfWeek}`)
        error = true
      }
      if (nextWeekOfYear !== 1) { // next week must be 1
        spinner.fail(`Year ${nextYearOfWeek} started with non-Week 01! Year started with week number ${nextWeekOfYear}`)
        error = true
      }
      if (!(thisWeekOfYear === 50 || thisWeekOfYear === 51)) { // previous week for ending HWC year must be 50 or 51
        spinner.fail(`Year ${thisYearOfWeek} ended with non-Week 50/51! Year ended with week number ${thisWeekOfYear}`)
        error = true
      }
      if (nextDayOfWeek !== 1) { // Start HWC year's weekday must be 1
        spinner.fail(`Year ${nextYearOfWeek} started with non-weekday 1! Year started with weekday ${nextDayOfWeek}`)
        error = true
      }
      if (thisDayOfWeek !== 7) { // Ending HWC year's weekday must end with 7
        spinner.fail(`Year ${thisYearOfWeek} ended with non-weekday 7! Year ended with weekday ${thisDayOfWeek}`)
        error = true
      }
      // with a new HWC year check that Week 01 has 4th Muharram
      if (nextWeekOfYear === 1) {
        let muharram4 = false
        for (let m = 0; m < 13; m++) {
          //
          if ((i + m) >= listSize || (dates[i + m][1] === 1 && dates[i + m][2] === 4)) {
            muharram4 = true
            break
          }
        }
        if (!muharram4) {
          spinner.fail(`4th Muharram for year ${nextYearOfWeek} does not fall in Week 01`)
          error = true
        }
      }
    }

    // ----------- Validate at Change of HWC Weeks --------
    if (nextWeekOfYear !== thisWeekOfYear) { // a new week has started
      if (thisWeekOfYear === 51 && nextWeekOfYear !== 1) {
        spinner.fail(`Week 51 is not followed by Week 01 in year ${nextYearOfWeek}`)
        error = true
      }
      if (nextWeekOfYear === 1) { // if next week is Week 01
        if (!(thisWeekOfYear === 50 || thisWeekOfYear === 51)) { // then previous week must be 50 or 51
          spinner.fail(`Week not in sequence in year ${nextYearOfWeek}. Week 01 after Week ${thisWeekOfYear}`)
          error = true
        }
      }
      else if ((nextWeekOfYear - thisWeekOfYear) !== 1) { // weeks must be in sequence
        spinner.fail(`Week not in sequence in year ${nextYearOfWeek}. Week ${nextWeekOfYear} after Week ${thisWeekOfYear}`)
        error = true
      }
    }

    // ----------- Validate at Change of HWC weekdays --------
    if (nextDayOfWeek !== thisDayOfWeek) { // a new weekday has started
      if (nextDayOfWeek === 1) { // this week ended, must have 7 weekdays count so far
        weekArray = [] // flush the weeks array list
        if (daysCount !== 7) {
          spinner.fail(`Week has less than 7 weekdays found in year ${nextYearOfWeek}, week ${nextWeekOfYear}. At weekday ${nextDayOfWeek}`)
          error = true
        }
      }

      if (nextDayOfWeek === 1) { // if next weekday is weekday 1
        if (thisDayOfWeek !== 7) { // then previous weekday must be 7
          spinner.fail(`Weekday not in sequence in year ${nextYearOfWeek}. Weekday 1 after weekday ${thisDayOfWeek}`)
          error = true
        }
      }
      else if ((nextDayOfWeek - thisDayOfWeek) !== 1) { // weekdays must be in sequence
        spinner.fail(`Weekday not in sequence in year ${nextYearOfWeek}, week ${nextWeekOfYear}. Weekday ${nextDayOfWeek} found after weekday ${thisDayOfWeek}`)
        error = true
      }
      // weekdays are now Good
      daysCount++ // increment weekday count
      weekArray.push(nextWeekOfYear) // remember the week no. for the weekday

      // check that all weekdays fall in the same Week
      if (!allEqual(weekArray)) {
        spinner.fail(`Weekday with incorrect Week in year ${nextYearOfWeek}, week ${nextWeekOfYear}, weekday ${nextDayOfWeek}`)
        error = true
      }

    // else we have duplicate weekdays
    }
    else {
      spinner.fail(`Weekday duplicate in year ${nextYearOfWeek}, week ${nextWeekOfYear}, weekday ${nextDayOfWeek}.`)
      error = true
    }

    // so far all is ok
    thisYearOfWeek = nextYearOfWeek // update year number
    thisHYear = nextHYear // update year number
    thisWeekOfYear = nextWeekOfYear // update week number
    thisDayOfWeek = nextDayOfWeek // update weekday number
    if (thisDayOfWeek === 1)
      daysCount = 1 // reset weekday count to 1
  } // loop again for the next HWC date
  // all dates done.....
  error ? spinner.fail(kleur.red('Generated dates are not valid.\n')) : spinner.succeed(kleur.green('Generated dates are valid.\n'))
}

// =======================================================
function checkStartDate(dates: number[][], thisHYear: number, thisHMonth: number, thisHDay: number, thisYearOfWeek: number, thisWeekOFYear: number, thisDayOfWeek: number, spinner: Ora) {
  let error = false
  let lastWeekPivotDay = 27 // default to 12/27
  const hStartIndex = dates.findIndex((row) => {
    const [hYear, hMonth, hDay] = row
    return (hYear === thisHYear) && (hMonth === 1) && (hDay === 1)
  })
  let hEndIndex = dates.findIndex((row) => {
    const [hYear, hMonth, hDay] = row
    return (hYear === thisHYear) && (hMonth === 12) && (hDay === 30)
  })
  if (hEndIndex < 0) {
    hEndIndex = dates.findIndex((row) => {
      const [hYear, hMonth, hDay] = row
      return (hYear === thisHYear) && (hMonth === 12) && (hDay === 29)
    })
    lastWeekPivotDay = 26 // change to 12/26
  }

  const hYearSize = (hEndIndex - hStartIndex + 1) // get the length of Hijri Year

  if ((hYearSize > 355) || (hYearSize < 354)) {
    spinner.fail(kleur.red(`The Hijri year ${thisHYear} is ${hYearSize} days. That is not possible. This is an error or bug in the original Hijri Date and not in the HWC system.`))
    error = true
  }

  const hLeap = (hYearSize === 355)
  const indexPivotDay = dates.findIndex((row) => {
    const [hYear, hMonth, hDay] = row
    return (hYear === thisHYear) && (hMonth === 12) && (hDay === lastWeekPivotDay)
  }) // get date on 12/26 or 12/27
  const hwcPivot = dates[indexPivotDay]
  const [_y, _m, _d, _yow, totalWeeks, _dow] = hwcPivot // get total week for corresponding HWC Year
  const dayName = ['', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  if (hLeap) {
    if ([1, 2, 3, 4, 7].includes(thisDayOfWeek) && totalWeeks !== 51) {
      spinner.fail(kleur.red(`The Hijri leap year ${thisHYear} starts on ${dayName[thisDayOfWeek]} but the total HWC weeks is 50. ${thisHYear} must have a total of 51 weeks.`))
      error = true
    }
    if ([5, 6].includes(thisDayOfWeek) && totalWeeks !== 50) {
      spinner.fail(kleur.red(`The Hijri leap year ${thisHYear} starts on ${dayName[thisDayOfWeek]} but the total HWC weeks is 51. ${thisHYear} must have a total of 50 weeks.`))
      error = true
    }
  }
  else { // common year
    if ([1, 2, 3, 4].includes(thisDayOfWeek) && totalWeeks !== 51) {
      spinner.fail(kleur.red(`The Hijri common year ${thisHYear} starts on ${dayName[thisDayOfWeek]} but the total HWC weeks is 50. ${thisHYear} must have a total of 51 weeks.`))
      error = true
    }
    if ([5, 6, 7].includes(thisDayOfWeek) && totalWeeks !== 50) {
      spinner.fail(kleur.red(`The Hijri leap year ${thisHYear} starts on ${dayName[thisDayOfWeek]} but the total HWC weeks is 51. ${thisHYear} must have a total of 50 weeks.`))
      error = true
    }
  }
  return error
}

// =======================================================
export async function dataValidator() {
  const umalqura = await storage.getItem<number[][]>('dates:islamic-umalqura')
  const civil = await storage.getItem<number[][]>('dates:islamic-civil')
  const tbla = await storage.getItem<number[][]>('dates:islamic-tbla')

  const umalquraSpinner = ora({
    text: `Validating ${kleur.yellow('islamic-umalqura')} dates\n`,
    spinner: 'clock',
  })

  const civilSpinner = ora({
    text: `Validating ${kleur.yellow('islamic-civil')} dates\n`,
    spinner: 'clock',
  })

  const tblaSpinner = ora({
    text: `Validating ${kleur.yellow('islamic-tbla')} dates\n`,
    spinner: 'clock',
  })

  if (!umalqura || !civil || !tbla)
    throw new Error('Data is not generated')

  // validating umalqura
  umalquraSpinner.start()
  validateDates(umalqura, umalquraSpinner)

  // validating civil
  civilSpinner.start()
  validateDates(civil, civilSpinner)

  // validating tbla
  tblaSpinner.start()
  validateDates(tbla, tblaSpinner)
}
