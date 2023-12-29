import { describe, expect, it } from 'vitest'
import { hwcToString, toHWCDate, totalHWCWeeks } from '../src/core'

describe('calculations from Hijri to Hijri Week Calendar', () => {
  it('should output the right Hijri Week Dates', () => {
    expect(hwcToString(toHWCDate(1445, 6, 14))).toEqual('1445-W23-5')
    expect(hwcToString(toHWCDate(1445, 6, 14, { fromCal: 'islamic-civil' }))).toEqual('1445-W23-5')
    expect(hwcToString(toHWCDate(1445, 6, 14, { fromCal: 'islamic-tbla' }))).toEqual('1445-W24-4')
    expect(hwcToString(toHWCDate(1, 1, 1))).toEqual('0-W51-7')
    expect(hwcToString(toHWCDate(1444, 2, 2))).toEqual('1444-W05-3')
    // Negative Hijri Year
    expect(hwcToString(toHWCDate(-1, 1, 1))).toEqual('-2-W51-5')
  })

  it('should calculate the total weeks in a year', () => {
    expect(totalHWCWeeks(1444)).toEqual(51)
    expect(totalHWCWeeks(1445)).toEqual(50)
    expect(totalHWCWeeks(1446)).toEqual(51)

    expect(totalHWCWeeks(1444, { fromCal: 'islamic-civil' })).toEqual(50)
    expect(totalHWCWeeks(1445, { fromCal: 'islamic-civil' })).toEqual(50)
    expect(totalHWCWeeks(1446, { fromCal: 'islamic-civil' })).toEqual(51)

    expect(totalHWCWeeks(1444, { fromCal: 'islamic-tbla' })).toEqual(50)
    expect(totalHWCWeeks(1445, { fromCal: 'islamic-tbla' })).toEqual(50)
    expect(totalHWCWeeks(1446, { fromCal: 'islamic-tbla' })).toEqual(51)
  })
})
