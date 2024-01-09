import { Temporal } from '@js-temporal/polyfill'
import { describe, expect, it } from 'vitest'
import { HWCUmalqura } from '../../src/calendars/HWCUmulqura'

describe('custom HWC Umulqura calendar should work', () => {
  it('should be instantiated without errors', () => {
    let customCalendar: Temporal.Calendar
    expect(() => customCalendar = new HWCUmalqura()).not.toThrow()
    expect(() => Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })).not.toThrow()
  })

  //   it('should have the right calendarId', () => {
  //     const hDate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: new HWCUmalqura() })
  //     expect(hDate.calendarId).toBe('hwc-islamic-umalqura')
  //   })

  it('should return the correct year of week', () => {
    const customCalendar = new HWCUmalqura()
    const Hdate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    expect(customCalendar.yearOfWeek(Hdate)).toBe(1444)
    // expect(Hdate.yearOfWeek).toBe(1444)
  })

  it('should return the correct week of year', () => {
    const customCalendar = new HWCUmalqura()
    const Hdate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    expect(customCalendar.weekOfYear(Hdate)).toBe(5)
    // expect(Hdate.weekOfYear).toBe(5)
  })

  it('should return the correct day of HWC date', () => {
    const customCalendar = new HWCUmalqura()
    const Hdate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    expect(customCalendar.dayOfHWCDate(Hdate)).toBe(4)
  })

  it('should return the correct weeks in year count', () => {
    const customCalendar = new HWCUmalqura()
    const Hdate = Temporal.PlainDate.from({ year: 1444, month: 2, day: 3, calendar: customCalendar })
    expect(customCalendar.weeksInYear(Hdate)).toBe(51)
  })
})
