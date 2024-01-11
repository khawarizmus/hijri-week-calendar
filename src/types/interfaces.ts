import type { Temporal } from '@js-temporal/polyfill'
import type { HWCRepresentation } from '../core/representation'

export type SupportedHijriCalendars = 'islamic-umalqura' | 'islamic-civil' | 'islamic-tbla'

export type HWCLike = number[] | string | number

export interface HWCCalendarProtocol extends Temporal.CalendarProtocol {
  dayOfHWCDate(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number
  HWCRepresentation(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): HWCRepresentation
  hijriDayOfWeek(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number
  weeksInYear(date: string | Temporal.PlainDate | Temporal.PlainDateTime | Temporal.PlainDateLike): number
}
