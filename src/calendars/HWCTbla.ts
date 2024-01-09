import { Temporal } from '@js-temporal/polyfill'
import { hijriDayOfWeek as _hijriDayOfWeek, toHWCDate, totalHWCWeeks } from '..'
import type { SupportedHijriCalendars } from '../types'
import { HWCRepresentation } from '../core/representation'

export class HWCTbla extends Temporal.Calendar {
  readonly id: string
  readonly superId: SupportedHijriCalendars

  constructor() {
    super('islamic-tbla')
    this.id = 'hwc-islamic-tbla'
    this.superId = 'islamic-tbla'
  }

  yearOfWeek(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date)
    return toHWCDate(Hdate.year, Hdate.month, Hdate.day, this.superId)[0]
  }

  weekOfYear(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date)
    return toHWCDate(Hdate.year, Hdate.month, Hdate.day, this.superId)[1]
  }

  dayOfHWCDate(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date)
    return toHWCDate(Hdate.year, Hdate.month, Hdate.day, this.superId)[2]
  }

  HWCRepresentation(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): HWCRepresentation {
    return new HWCRepresentation(this.yearOfWeek(date), this.weekOfYear(date), this.dayOfHWCDate(date), this.superId)
  }

  hijriDayOfWeek(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    return _hijriDayOfWeek(this.dayOfWeek(date))
  }

  weeksInYear(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date)
    return totalHWCWeeks(Hdate.year, this.superId)
  }

  toJSON(): string {
    return this.id
  }

  toString(): string {
    return this.id
  }

  // TODO: override dateFromFields(), monthDayFromFields(), yearMonthFromFields(), and dateAdd() so that they return Temporal objects with the custom calendar and not the base calendar.

  //   dateFromFields(fields: Temporal.YearOrEraAndEraYear & Temporal.MonthOrMonthCode & { day: number }, options?: Temporal.AssignmentOptions | undefined): Temporal.PlainDate {
  //     return Temporal.PlainDate.from({ ...fields, calendar: this }, options)
  //   }

  yearMonthFromFields(fields: Temporal.YearOrEraAndEraYear & Temporal.MonthOrMonthCode, options?: Temporal.AssignmentOptions): Temporal.PlainYearMonth {
    return Temporal.PlainYearMonth.from({ ...fields, calendar: this }, options)
  }

  monthDayFromFields(fields: Temporal.MonthCodeOrMonthAndYear & { day: number }, options?: Temporal.AssignmentOptions): Temporal.PlainMonthDay {
    return Temporal.PlainMonthDay.from({ ...fields, calendar: this }, options)
  }

  dateAdd(date: Temporal.PlainDate | Temporal.PlainDateLike | string, duration: Temporal.Duration | Temporal.DurationLike | string, options?: Temporal.ArithmeticOptions): Temporal.PlainDate {
    const hDate = Temporal.PlainDate.from(date).withCalendar(this)
    return hDate.add(duration, { ...options })
  }
}
