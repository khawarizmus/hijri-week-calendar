import { Temporal } from '@js-temporal/polyfill'
import type { HWCCalendarProtocol } from './types/interfaces'

// Exports
export { toHWCDate, fromHWCDate } from './core/core'
export { hijriDayOfWeek, hwcToString, hwcToCompactString, validateHWC, totalHWCWeeks } from './core/utils'
export { HWCRepresentation } from './core/representation'
// calendars
export { HWCUmalqura } from './calendars/HWCUmulqura'
export { HWCCivil } from './calendars/HWCCivil'
export { HWCTbla } from './calendars/HWCTbla'

// defining extra properties on Temporal.PlainDate

Object.defineProperty(Temporal.PlainDate.prototype, 'dayOfHWCDate', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).dayOfHWCDate(this)
    else
      throw new Error('dayOfHWCDate is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDate.prototype, 'HWCRepresentation', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).HWCRepresentation(this)
    else
      throw new Error('HWCRepresentation is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDate.prototype, 'hijriDayOfWeek', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).hijriDayOfWeek(this)
    else
      throw new Error('hijriDayOfWeek is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDate.prototype, 'weeksInYear', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).weeksInYear(this)
    else
      throw new Error('weeksInYear is only available for Hijri week calendars')
  },
})

// defining extra properties on Temporal.PlainDateTime

Object.defineProperty(Temporal.PlainDateTime.prototype, 'dayOfHWCDate', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).dayOfHWCDate(this)
    else
      throw new Error('dayOfHWCDate is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDateTime.prototype, 'HWCRepresentation', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).HWCRepresentation(this)
    else
      throw new Error('HWCRepresentation is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDateTime.prototype, 'hijriDayOfWeek', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).hijriDayOfWeek(this)
    else
      throw new Error('hijriDayOfWeek is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.PlainDateTime.prototype, 'weeksInYear', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).weeksInYear(this)
    else
      throw new Error('weeksInYear is only available for Hijri week calendars')
  },
})

// defining extra properties on Temporal.ZonedDateTime

Object.defineProperty(Temporal.ZonedDateTime.prototype, 'dayOfHWCDate', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).dayOfHWCDate(this)
    else
      throw new Error('dayOfHWCDate is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.ZonedDateTime.prototype, 'HWCRepresentation', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).HWCRepresentation(this)
    else
      throw new Error('HWCRepresentation is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.ZonedDateTime.prototype, 'hijriDayOfWeek', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).hijriDayOfWeek(this)
    else
      throw new Error('hijriDayOfWeek is only available for Hijri week calendars')
  },
})

Object.defineProperty(Temporal.ZonedDateTime.prototype, 'weeksInYear', {
  get() {
    if (['hwc-islamic-umalqura', 'hwc-islamic-tbla', 'hwc-islamic-civil'].includes(this.calendarId))
      return (this.getCalendar() as HWCCalendarProtocol).weeksInYear(this)
    else
      throw new Error('weeksInYear is only available for Hijri week calendars')
  },
})
