import { hwcToString } from '..'
import type { SupportedHijriCalendars } from '../types/interfaces'
import { hwcToCompactString } from './utils'

export class HWCRepresentation {
  readonly yearOfWeek: number
  readonly weekOfYear: number
  readonly dayOfWeek: number
  readonly calendar: SupportedHijriCalendars

  constructor(yearOfWeek: number, weekOfYear: number, dayOfWeek: number, calendar: SupportedHijriCalendars = 'islamic-umalqura') {
    this.yearOfWeek = yearOfWeek
    this.weekOfYear = weekOfYear
    this.dayOfWeek = dayOfWeek
    this.calendar = calendar
  }

  toString(): string {
    return hwcToString([this.yearOfWeek, this.weekOfYear, this.dayOfWeek])
  }

  toStringCompact(): string {
    return hwcToCompactString([this.yearOfWeek, this.weekOfYear, this.dayOfWeek])
  }
}
