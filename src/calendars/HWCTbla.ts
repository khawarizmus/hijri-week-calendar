import { Temporal } from '@js-temporal/polyfill'
import { hijriDayOfWeek as _hijriDayOfWeek, toHWCDate, totalHWCWeeks } from '..'
import type { SupportedHijriCalendars } from '../types/interfaces'
import { HWCRepresentation } from '../core/representation'

////////////////////////////////////////////////////////////////////////
//                                                                    //
//                Hijri-Week Calendar Tabular Islamic Calendar        //
//                                                                    //
//                   Custom Temporal Calendar                         //
//                                                                    //
////////////////////////////////////////////////////////////////////////

/*
* @inspired by : Mohsen Alyafei (https://github.com/MohsenAlyafei)
* @author      : khawarizmus (https://github.com/khawarizmus)
* @Licence     : MIT
* @date        : 9 Jan 2024 (28-06-1445 AH) (HWC Date: 1445-W26-4) (Tabular Islamic Calendar)
*/

export class HWCTbla extends Temporal.Calendar {
  readonly id: string
  readonly superId: SupportedHijriCalendars

  constructor() {
    super('islamic-tbla')
    this.id = 'hwc-islamic-tbla'
    this.superId = 'islamic-tbla'
  }

  yearOfWeek(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date).withCalendar(this.superId)
    return toHWCDate(Hdate.year, Hdate.month, Hdate.day, this.superId)[0]
  }

  weekOfYear(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date).withCalendar(this.superId)
    return toHWCDate(Hdate.year, Hdate.month, Hdate.day, this.superId)[1]
  }

  toJSON(): string {
    return this.id
  }

  toString(): string {
    return this.id
  }

  // custom accessors
  dayOfHWCDate(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number {
    const Hdate = Temporal.PlainDate.from(date).withCalendar(this.superId)
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

  // overriding base calendar logic to use this calendar
  dateFromFields(fields: Temporal.YearOrEraAndEraYear & Temporal.MonthOrMonthCode & { day: number }, options?: Temporal.AssignmentOptions | undefined): Temporal.PlainDate {
    const native = Temporal.PlainDate.from({ ...fields, calendar: 'islamic-tbla' }, options)
    return native.withCalendar(this)
  }

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
