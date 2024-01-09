////////////////////////////////////////////////////////////////////////
//                                                                    //
//                Hijri-Week Calendar Date System                     //
//                                                                    //
//                   Functions and Core Code                          //
//                                                                    //
////////////////////////////////////////////////////////////////////////
import { Temporal } from '@js-temporal/polyfill'
import type { HWCLike, SupportedHijriCalendars } from '../types'
import { validateHWC } from './utils'

/********************************************************
* @function    : toHWCDate(year, month, day [, fromCal])
*                -------------- Core Function --------------
*                to implement the Hijri Week Calendar (HWC) System
*                using similar concepts as the ISO Week Date Calendar.
*                Returns the Hijri Week Calender (HWC) Date from a given Hijri Date.
*                in the format: yearOfWeek, weekOfYear, weekday.
*                [Note]: Uses the Javascript Temporal API.
*
* @purpose     : To convert a Hijri Date (any Hijri/Islamic Calendar) into the
*                Hijri Week Calendar (HWC) System Date in the format: year of week, week of year, weekday.
*
* @inspired by : khawarizmus @gimyboya
* @version     : 1.03
* @author      : Mohsen Alyafei (https://github.com/MohsenAlyafei)
* @Licence     : MIT
* @date        : 27 Dec 2023 (14-06-1445 AH) (HWC Date: 1445-W23-05)
* @param       : year   :   [required] Hijri Year Number
*                month  :   [required] Hijri month Number (1-12)
*                day    :   [required] Hijri day Number (1-30)
*                fromCal:   [optional] The Hijri calendar type (default: "islamic-umalqura")

* @returns     : [array] of the HWC Date as: [yearOfWeek, weekOfYear, weekday];
*                The output can then be formatted into other string formats if needed.
*
********************************************************/
export function toHWCDate(year: number, month: number, day: number, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
  const hijriDate = Temporal.PlainDate.from({ year, month, day, calendar })
  const hwcDayOfWeek = (hijriDate.dayOfWeek + 2) % 7 || 7 // Hijri weekday: Sat is day 1 and Friday day 7
  const hwcMidDate = hijriDate.add({ days: 4 - hwcDayOfWeek }) // the middle date of the HWC week (on Tuesday)
  const hwcYearStart = Temporal.PlainDate.from({ year: hwcMidDate.year, month: 1, day: 1, calendar })
  const hwcWeekOfYear = Math.ceil((hwcMidDate.since(hwcYearStart).days + 1) / 7) // calculate HWC week number

  return [
    hwcMidDate.year, // HWC Year
    hwcWeekOfYear, // HWC Week (1 to 50 or 51)
    hwcDayOfWeek, // HWC Weekday (Sat 1 to Friday 7)
  ]
}

//* ******************************************************
// converts an HWC Date [year, week, day] to a Hijri Date
// if day (or week and day) are missing they are assumed day 1 (or week 1, day 1);
// fromHWCDate [year, week, day] returns the Hijri Date of the HWC year, week, and date
// fromHWCDate [year, week] returns the Hijri Date of the 1st day of the HWC year and week
// fromHWCDate [year] returns the Hijri Date of the 1st day 1st week of the HWC year
// The input HWC Date may be an array or a date string
//
// examples:
// fromHWCDate("1445-w21-5");
// fromHWCDate("1445-w21");     // day 1 assumed
// fromHWCDate("1445w215");
// fromHWCDate("1445w21");      // day 1 assumed
// fromHWCDate("1445w21","islamic-civil");
// fromHWCDate([1445, 21, 5]);
// fromHWCDate([1445, 21]);     // day 1 assumed
// fromHWCDate([1445]);         // week 1 day 1 assumed
//
export function fromHWCDate(hwcDate: HWCLike, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
  const [year, week, day] = validateHWC(hwcDate, calendar) // get validated HWC date
  let date = Temporal.PlainDate.from({ year, month: 1, day: 4, calendar }) // 4th Muharram (yyyy-01-04)
  date = date.add({ days: (week - 1) * 7 + day - ((date.dayOfWeek + 2) % 7 || 7) })
  return [date.year, date.month, date.day]
}
