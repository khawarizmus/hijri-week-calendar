import { Temporal } from '@js-temporal/polyfill'

// ==============================================

/********************************************************
*
@function
    : toHWCDate(year, month, day [, fromCal])
*                -------------- Core Function --------------
*                to implement the Hijri Week Calendar (HWC) System
*                using similar concepts as the ISO Week Date Calendar.
*                Returns the Hijri Week Calender (HWC) Date from a given Hijri Date.
*                in the format: year, week, weekday.
*                [Note]: Uses the Javascript Temporal API.
*
*
@purpose
     : To convert a Hijri Date (any Hijri/Islamic Calendar) into the
*                Hijri Week Calendar (HWC) System Date in the format: year, week, weekday.
*
*
@inspired
 by : khawarizmus
@gimyboya

*
@version
     : 1.00
*
@author
      : Mohsen Alyafei (https://github.com/MohsenAlyafei)
*
@Licence
     : MIT
* @date        : 27 Dec 2023 (14-06-1445 AH) (HWC Date: 1445-W23-05)
*
@param
       : year   :   [required] Hijri Year Number
*                month  :   [required] Hijri month Number (1-12)
*                day    :   [required] Hijri day Number (1-30)
*                fromCal:   [optional] The Hijri calendar type (default: "islamic-umalqura")

* @returns     : [array] of the HWC Date as: [year, week, weekday];
*                The output can then be formatted into other string formats if needed.
*
********************************************************/
export function toHWCDate(year: number, month: number, day: number, { fromCal = 'islamic-umalqura' } = {}): [number, number, number] {
  const hijriDate = Temporal.PlainDate.from({ year, month, day, calendar: fromCal })
  const hwcWeekDay = (hijriDate.dayOfWeek + 2) % 7 || 7 // Hijri weekday: Sat is day 1 and Friday day 7
  const hwcMidDate = hijriDate.add({ days: 4 - hwcWeekDay }) // the middle date of the HWC week (on Tuesday)
  const hwcYearStart = Temporal.PlainDate.from({ year: hwcMidDate.year, month: 1, day: 1, calendar: fromCal })
  const hwcWeek = Math.ceil((hwcMidDate.since(hwcYearStart).days + 1) / 7) // calculate HWC week number

  return [
    hwcMidDate.year, // HWC Year is the same as Hijri Year
    hwcWeek, // HWC Week (50 or 51)
    hwcWeekDay, // HWC Weekday (Sat 1 to Friday 7)
  ]
}

// ================================================
// converts an HWC Date array returned from toHWCDate()
// to an ISO-like string format "yyyy-Www-dd"
export function hwcToString(array: [number, number, number]) {
  return `${(`${array[0]}`)}-W${(`${array[1]}`).padStart(2, '0')}-${(`${array[2]}`)}`
}
// ================================================

/********************************************************
* @function    : totalHWCWeeks(year [, fromCal])
* @param       : year   :   [required] HWC Year
* @returns     : total weeks in HWC Year
*
* Using the 'lastWeekPivotDay' which is the day 3 days before the end of the last month of the year.
* First get 3rd day before the year end (either 26th or 27th of month 12).
* Then get the week number for that day using toHWCDate() being the last week of the HWC year.
********************************************************/
export function totalHWCWeeks(y: number, { fromCal = 'islamic-umalqura' } = {}) {
  const d = Temporal.PlainDate.from({ year: y, month: 12, day: 30, calendar: fromCal }).subtract({ days: 3 })
  return toHWCDate(y, 12, d.day)[1]
}
