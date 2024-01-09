import { describe, expect, it } from 'vitest'
import { toHWCDate } from '../../src'
import { hijriDayOfWeek, hwcFromString, hwcToCompactString, hwcToString, totalHWCWeeks, validateHWC } from '../../src/core/utils'

describe('calculations from Hijri to Hijri Week Calendar', () => {
  it('should convert Hijri Week Calendar days to Temporal days', () => {
    const HijriMonday = hijriDayOfWeek(1) // Monday in hijri should be 3
    expect(HijriMonday).toEqual(3)
    const HijriTuesday = hijriDayOfWeek(2) // Friday in hijri should be 4
    expect(HijriTuesday).toEqual(4)
    const HijriWednesday = hijriDayOfWeek(3) // Saturday in hijri should be 5
    expect(HijriWednesday).toEqual(5)
    const HijriThursday = hijriDayOfWeek(4) // Sunday in hijri should be 6
    expect(HijriThursday).toEqual(6)
    const HijriFriday = hijriDayOfWeek(5) // Monday in hijri should be 7
    expect(HijriFriday).toEqual(7)
    const HijriSaturday = hijriDayOfWeek(6) // Tuesday in hijri should be 1
    expect(HijriSaturday).toEqual(1)
    const HijriSunday = hijriDayOfWeek(7) // Wednesday in hijri should be 2
    expect(HijriSunday).toEqual(2)
  })

  it('should format the Hijri Week Calendar date to string', () => {
    expect(hwcToString([1445, 23, 5])).toEqual('1445-W23-5')
    expect(hwcToString([0, 51, 7])).toEqual('0-W51-7')
    expect(hwcToString([1444, 5, 3])).toEqual('1444-W05-3')
    // Negative Hijri Year
    expect(hwcToString([-2, 51, 5])).toEqual('-2-W51-5')
    // big numbers
    expect(hwcToString([999999, 51, 7])).toEqual('999999-W51-7')
    expect(hwcToString([-99999, 51, 7])).toEqual('-99999-W51-7')
  })

  it('should format the Hijri Week Calendar date to compact string', () => {
    expect(hwcToCompactString([1445, 23, 5])).toEqual('1445W235')
    expect(hwcToCompactString([0, 51, 7])).toEqual('0W517')
    expect(hwcToCompactString([1444, 5, 3])).toEqual('1444W053')
    // Negative Hijri Year
    expect(hwcToCompactString([-2, 51, 5])).toEqual('-2W515')
    // big numbers
    expect(hwcToCompactString([999999, 51, 7])).toEqual('999999W517')
    expect(hwcToCompactString([-99999, 51, 7])).toEqual('-99999W517')
  })

  it('should output the right Hijri Week Dates', () => {
    expect(hwcToString(toHWCDate(1445, 6, 14))).toEqual('1445-W23-5')
    expect(hwcToString(toHWCDate(1445, 6, 14, 'islamic-civil'))).toEqual('1445-W23-5')
    expect(hwcToString(toHWCDate(1445, 6, 14, 'islamic-tbla'))).toEqual('1445-W24-4')
    expect(hwcToString(toHWCDate(1, 1, 1))).toEqual('0-W51-7')
    expect(hwcToString(toHWCDate(1444, 2, 2))).toEqual('1444-W05-3')
    // Negative Hijri Year
    expect(hwcToString(toHWCDate(-1, 1, 1))).toEqual('-2-W51-5')
  })

  it('should output correct Hijri week calendar components from string', () => {
    expect(hwcFromString('1445-W23-5')).toEqual([1445, 23, 5])
    expect(hwcFromString('1445-W23')).toEqual([1445, 23, 1])
    expect(hwcFromString('1445')).toEqual([1445, 1, 1])
    expect(hwcFromString('1445W235')).toEqual([1445, 23, 5])
    expect(hwcFromString('1445W23')).toEqual([1445, 23, 1])
    // negative year
    expect(hwcFromString('-2W515')).toEqual([-2, 51, 5])
    expect(hwcFromString('-2W51')).toEqual([-2, 51, 1])
    expect(hwcFromString('-2')).toEqual([-2, 1, 1])
    // big numbers
    expect(hwcFromString('999999W517')).toEqual([999999, 51, 7])
    expect(hwcFromString('-99999W517')).toEqual([-99999, 51, 7])

    // invalid strings
    expect(() => hwcFromString('something-W23-8')).toThrow('Invalid Year in HWC Date string.')
    expect(() => hwcFromString('1445-W23-something')).toThrow('Invalid Weekday in HWC Date string.')
    expect(() => hwcFromString('1445-W23-8')).toThrow('Invalid Weekday in HWC Date string.')
    expect(() => hwcFromString('1445-W53-5')).toThrow('Invalid Week in HWC Date string.')
    expect(() => hwcFromString('1445-W0-5')).toThrow('Invalid Week in HWC Date string.')
    expect(() => hwcFromString('1445-W-5')).toThrow('Invalid Week in HWC Date string.')
    expect(() => hwcFromString('1445-W-5-4')).toThrow('Invalid Week in HWC Date string.')
    expect(() => hwcFromString('1445-Wsomething')).toThrow('Invalid Weekday in HWC Date string.')
  })

  it('should calculate the total weeks in a year', () => {
    expect(totalHWCWeeks(1444)).toEqual(51)
    expect(totalHWCWeeks(1445)).toEqual(50)
    expect(totalHWCWeeks(1446)).toEqual(51)

    expect(totalHWCWeeks(1444, 'islamic-civil')).toEqual(51)
    expect(totalHWCWeeks(1445, 'islamic-civil')).toEqual(50)
    expect(totalHWCWeeks(1446, 'islamic-civil')).toEqual(51)

    expect(totalHWCWeeks(1444, 'islamic-tbla')).toEqual(50)
    expect(totalHWCWeeks(1445, 'islamic-tbla')).toEqual(51)
    expect(totalHWCWeeks(1446, 'islamic-tbla')).toEqual(51)
  })

  it('should validate the Hijri Week Calendar date', () => {
    // year only
    expect(validateHWC(1445)).toEqual([1445, 1, 1])
    // string
    expect(validateHWC('1445')).toEqual([1445, 1, 1])
    expect(validateHWC('1445-W23')).toEqual([1445, 23, 1])
    expect(validateHWC('1445-W23-5')).toEqual([1445, 23, 5])
    // // array
    expect(validateHWC([1445])).toEqual([1445, 1, 1])
    // expect(validateHWC([1445, 4])).toEqual([1445, 4, 1])
    // expect(validateHWC([1445, 3, 6])).toEqual([1445, 3, 6])
    // else throw error
  })
})
