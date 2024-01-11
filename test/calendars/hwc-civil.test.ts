import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { HWCCivil } from '../../src/calendars/HWCCivil'

describe('custom HWC Civil calendar should work', () => {
  it('should be instantiated without errors', () => {
    let customCalendar: Temporal.Calendar
    expect(() => customCalendar = new HWCCivil()).not.toThrow()
    expect(() => Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })).not.toThrow()
  })

  it('should have the right calendarId', () => {
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: new HWCCivil() })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: new HWCCivil() })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: new HWCCivil() })
    expect(HWCDate.calendarId).toBe('hwc-islamic-civil')
    expect(HWCDateTime.calendarId).toBe('hwc-islamic-civil')
    expect(HWCZonedDate.calendarId).toBe('hwc-islamic-civil')
  })

  it('should return the correct year of week', () => {
    const customCalendar = new HWCCivil()
    const HWCdate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCdateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCzonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.yearOfWeek(HWCdate)).toBe(1444) // pass
    expect(HWCdate.yearOfWeek).toBe(1444)
    expect(HWCdateTime.yearOfWeek).toBe(1444)
    expect(HWCzonedDate.yearOfWeek).toBe(1444)
  })

  it('should return the correct week of year', () => {
    const customCalendar = new HWCCivil()
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.weekOfYear(HWCDate)).toBe(5)
    expect(HWCDate.weekOfYear).toBe(5)
    expect(HWCDateTime.weekOfYear).toBe(5)
    expect(HWCZonedDate.weekOfYear).toBe(5)
  })

  it('should return the correct day of HWC date', () => {
    const customCalendar = new HWCCivil()
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.dayOfHWCDate(HWCDate)).toBe(5)
    expect(HWCDate.dayOfHWCDate).toBe(5)
    expect(HWCDateTime.dayOfHWCDate).toBe(5)
    expect(HWCZonedDate.dayOfHWCDate).toBe(5)
  })

  it('should return the correct weeks in year count', () => {
    const customCalendar = new HWCCivil()
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.weeksInYear(HWCDate)).toBe(51)
    expect(HWCDate.weeksInYear).toBe(51)
    expect(HWCDateTime.weeksInYear).toBe(51)
    expect(HWCZonedDate.weeksInYear).toBe(51)
  })

  it('should return the correct hijri day of week', () => {
    const customCalendar = new HWCCivil()
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.hijriDayOfWeek(HWCDate)).toBe(5)
    expect(HWCDate.hijriDayOfWeek).toBe(5)
    expect(HWCDateTime.hijriDayOfWeek).toBe(5)
    expect(HWCZonedDate.hijriDayOfWeek).toBe(5)
  })

  it('should return the correct HWC representation', () => {
    const customCalendar = new HWCCivil()
    const HWCDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCDateTime = Temporal.PlainDateTime.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    const HWCZonedDate = Temporal.ZonedDateTime.from({ year: 1444, month: 2, day: 3, timeZone: 'Asia/Riyadh', calendar: customCalendar })
    expect(customCalendar.HWCRepresentation(HWCDate)).toEqual({
      calendar: 'islamic-civil',
      dayOfWeek: 5,
      weekOfYear: 5,
      yearOfWeek: 1444,
    })
    expect(HWCDate.HWCRepresentation).toEqual({
      calendar: 'islamic-civil',
      dayOfWeek: 5,
      weekOfYear: 5,
      yearOfWeek: 1444,
    })
    expect(HWCDateTime.HWCRepresentation).toEqual({
      calendar: 'islamic-civil',
      dayOfWeek: 5,
      weekOfYear: 5,
      yearOfWeek: 1444,
    })
    expect(HWCZonedDate.HWCRepresentation).toEqual({
      calendar: 'islamic-civil',
      dayOfWeek: 5,
      weekOfYear: 5,
      yearOfWeek: 1444,
    })
  })
})
