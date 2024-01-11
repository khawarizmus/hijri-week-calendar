//* ******************************************************
//       The following are the helper functions

import { Temporal } from '@js-temporal/polyfill'
import type { HWCLike, SupportedHijriCalendars } from '../types/interfaces'
import { toHWCDate } from './core'

const isInRange = (num: number, min: number, max: number) => num >= min && num <= max

/********************************************************

/**
 * Converts the ISO day of the week to the corresponding Hijri Week Calendar day of the week.
 *
 * @param dayOfWeek The ISO day of the week, where Monday is represented as 1 and Sunday is represented as 7.
 * @returns The Hijri Week Calendar day of the week, where Saturday is represented as 1 and Friday is represented as 7.
 */
export function hijriDayOfWeek(dayOfWeek: number): number {
  return (dayOfWeek + 2) % 7 || 7
}

/********************************************************
  * @function    : validateHWC(thing)
  * @param       : thing   :   [required] either an array of [y, w, d]
  *                or a string 'yyyy-Www-d','yyyy-Www', 'yyyyWwwd', or 'yyyyWww'
  *
  * @returns     : Corrected HWC Date in array [y, w, d]
  *
  * @Dependencies: 1. totalHWCWeeks()
  *                2. hwcFromString
  *                3. hwcFromCompactString()
  * @Note        : Missing weekday assume day 1.
  *                Missing Week assumes Week 01
  *                days above 7 are truncated to 7
  *                weeks above max for the year are truncated to max
  *
  ********************************************************/
export function validateHWC(hwcDate: HWCLike, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
  let yearOfWeek, weekOfYear, dayOfWeek
  if (typeof hwcDate === 'number')
    return [hwcDate, 1, 1] // assume year only provided
  if (typeof hwcDate === 'string') {
    [yearOfWeek, weekOfYear, dayOfWeek] = hwcFromString(hwcDate)
  }
  else if (Array.isArray(hwcDate)) {
    [yearOfWeek, weekOfYear, dayOfWeek] = hwcDate

    if (weekOfYear && !isInRange(weekOfYear, 1, 51))
      throw new Error('Invalid HWC Date.')

    if (dayOfWeek && !isInRange(dayOfWeek, 1, 7))
      throw new Error('Invalid HWC Date.')
  }
  else { throw new TypeError('Invalid HWC Date.') }
  return hwcTruncate(yearOfWeek, weekOfYear, dayOfWeek, calendar) // truncate week and day if necessary
}

/********************************************************
    * @function    : totalHWCWeeks(year [, fromCal])
    * @param       : year   :   [required] HWC Year
    * @returns     : total weeks in HWC Year
    *
    * Using the 'lastWeekPivotDay' which is the day 3 days before the end of the last month of the year.
    * First get 3rd day before the year end (either 26th or 27th of month 12).
    * Then get the week number for that day using toHWCDate() being the last week of the HWC year.
    ********************************************************/
export function totalHWCWeeks(year: number, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
  const date = Temporal.PlainDate.from({ year, month: 12, day: 30, calendar }).subtract({ days: 3 })
  return toHWCDate(year, 12, date.day, calendar)[1]
}

// ================================================
export function hwcFromString(hwcDate: string) {
  function throwErr(component: string) {
    throw new Error(`Invalid ${component} in HWC Date string.`)
  }
  // convert HWC date string "yyyy-Www-d" to [year, week, day]
  // convert compact HWC date string "yyyyWwwd" to [year, week, day]
  // if day missing will be converted to [year, week, 1]
  // if week missing will be converted to [year, 1, 1]
  // no checks are made for valid week and day numbers
  //
  if (typeof hwcDate !== 'string')
    throwErr('')

  // check for 0 and negative week numbers
  if (hwcDate.match(/w/i) && Number(hwcDate.split(/w/i)[1].split('-')[0]) === 0)
    throwErr('Week')

  hwcDate = hwcDate.replace(/\s+/g, '').trim() // remove spaces
  const sign = hwcDate.startsWith('-') ? -1 : 1 // remember negative years
  hwcDate = hwcDate.replace(/-/g, '') // remove dashes if any

  const [year, weekAndDay] = hwcDate.split(/w/i)
  const yearOfWeek = Number(year) * sign // restore sign

  if (Number.isNaN(yearOfWeek))
    throwErr('Year')
  if (weekAndDay === undefined)
    return [yearOfWeek, 1, 1] // year only return [year, 1, 1]
  if (weekAndDay.length > 3)
    throwErr('Weekday')
  const weekOfYear = +weekAndDay.slice(0, 2)
  if (Number.isNaN(weekOfYear) || !isInRange(weekOfYear, 1, 51))
    throwErr('Week')
  let dayOfWeek = +weekAndDay.slice(2)
  if (!dayOfWeek || dayOfWeek === 0)
    dayOfWeek = 1 // year-week only ==> day=1
  if (Number.isNaN(dayOfWeek) || !isInRange(dayOfWeek, 1, 7))
    throwErr('Weekday')
  return [yearOfWeek, weekOfYear, dayOfWeek]
}

// ================================================
// converts HWC Date array [year, week, day] to date string format: "yyyy-Www-d"
// no checks are made for valid week and day numbers
export function hwcToString(HWCDate: [number, number, number] | number[]) {
  return `${HWCDate[0]}-W${(`${HWCDate[1]}`).padStart(2, '0')}-${HWCDate[2]}`
}

// ================================================
// converts HWC Date array [year, week, day] to compact date string format: "yyyyWwwd"
// no checks are made for valid week and day numbers
export function hwcToCompactString(HWCDate: [number, number, number] | number[]) {
  return `${HWCDate[0]}W${(`${HWCDate[1]}`).padStart(2, '0')}${HWCDate[2]}`
}

// ================================
// truncates the week and day if necessary
function hwcTruncate(yearOfWeek: number, weekOfYear: number, dayOfWeek: number, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
  weekOfYear = weekOfYear ?? 1 // if undefined then week = 1
  dayOfWeek = dayOfWeek ?? 1 // if undefined then day = 1
  dayOfWeek < 1 && (dayOfWeek = 1)
  dayOfWeek > 7 && (dayOfWeek = 7)
  weekOfYear < 1 && (weekOfYear = 1)
  const totalWeeks = totalHWCWeeks(yearOfWeek, calendar) // get max weeks for HWC year
  if (weekOfYear > totalWeeks)
    weekOfYear = totalWeeks // week cannot be > total weeks, ==> truncate
  return [yearOfWeek, weekOfYear, dayOfWeek]
}
