import { beforeEach, describe, expect, it } from 'vitest'
import { fromHWCDate, toHWCDate } from '../../src'
import { storage } from '../../scripts/store'

interface PopulatedContext {
  umalqura: any[]
  civil: any[]
  tbla: any[]
  START_YEAR: number
  END_YEAR: number
}

beforeEach<PopulatedContext>(async (conxtext) => {
  const umalqura = await storage.getItem<any[]>('dates:islamic-umalqura')
  const civil = await storage.getItem<any[]>('dates:islamic-civil')
  const tbla = await storage.getItem<any[]>('dates:islamic-tbla')
  const START_YEAR = await storage.getItem<number>('START_YEAR')
  const END_YEAR = await storage.getItem<number>('END_YEAR')
  if (!umalqura || !civil || !tbla || !START_YEAR || !END_YEAR)
    throw new Error('Data is not generated yet')

  conxtext.umalqura = umalqura
  conxtext.civil = civil
  conxtext.tbla = tbla
  conxtext.START_YEAR = START_YEAR
  conxtext.END_YEAR = END_YEAR
})

describe('should generate valid Hijri Week Calendar dates from Hijri dates', () => {
  it<PopulatedContext>('should work for Um Al-Qura calendar', ({ umalqura }) => {
    const calendar = 'islamic-umalqura'
    for (let i = 0; i < umalqura.length; i++) {
      const row = umalqura[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate = toHWCDate(y, m, d, calendar) // convert Hijri Date to HWC Date
      expect.soft(hwcDate[0]).toBe(yow)
      expect.soft(hwcDate[1]).toBe(w)
      expect.soft(hwcDate[2]).toBe(dow)
    }
  })
  it<PopulatedContext>('should work for Civil calendar', ({ civil }) => {
    const calendar = 'islamic-civil'
    for (let i = 0; i < civil.length; i++) {
      const row = civil[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate = toHWCDate(y, m, d, calendar) // convert Hijri Date to HWC Date
      expect.soft(hwcDate[0]).toBe(yow)
      expect.soft(hwcDate[1]).toBe(w)
      expect.soft(hwcDate[2]).toBe(dow)
    }
  })
  it<PopulatedContext>('should work for Tabular calendar', ({ tbla }) => {
    const calendar = 'islamic-tbla'
    for (let i = 0; i < tbla.length; i++) {
      const row = tbla[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate = toHWCDate(y, m, d, calendar) // convert Hijri Date to HWC Date
      expect.soft(hwcDate[0]).toBe(yow)
      expect.soft(hwcDate[1]).toBe(w)
      expect.soft(hwcDate[2]).toBe(dow)
    }
  })
})

describe('should generate valid Hijri dates back from Hijri Week Calendar dates', () => {
  it<PopulatedContext>('should work for Um Al-Qura calendar', ({ umalqura }) => {
    const calendar = 'islamic-umalqura'
    for (let i = 0; i < umalqura.length; i++) {
      const row = umalqura[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate: [number, number, number] = [yow, w, dow]
      const hijri = fromHWCDate(hwcDate, calendar) // convert HWC Date back to Hijri
      expect.soft(hijri[0]).toBe(y)
      expect.soft(hijri[1]).toBe(m)
      expect.soft(hijri[2]).toBe(d)
    }
  })

  it<PopulatedContext>('should work for Civil calendar', ({ civil }) => {
    const calendar = 'islamic-civil'
    for (let i = 0; i < civil.length; i++) {
      const row = civil[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate: [number, number, number] = [yow, w, dow]
      const hijri = fromHWCDate(hwcDate, calendar) // convert HWC Date back to Hijri
      expect.soft(hijri[0]).toBe(y)
      expect.soft(hijri[1]).toBe(m)
      expect.soft(hijri[2]).toBe(d)
    }
  })

  it<PopulatedContext>('should work for Tabular calendar', ({ tbla }) => {
    const calendar = 'islamic-tbla'
    for (let i = 0; i < tbla.length; i++) {
      const row = tbla[i]
      const [y, m, d, yow, w, dow] = row
      const hwcDate: [number, number, number] = [yow, w, dow]
      const hijri = fromHWCDate(hwcDate, calendar) // convert HWC Date back to Hijri
      expect.soft(hijri[0]).toBe(y)
      expect.soft(hijri[1]).toBe(m)
      expect.soft(hijri[2]).toBe(d)
      if (hijri[0] !== y || hijri[1] !== m || hijri[2] !== d)
        // eslint-disable-next-line no-console
        console.log(`Problematic on row: ${i} for hwcDate: ${hwcDate[0]}-W${hwcDate[1]}-${hwcDate[2]} Expected: ${y}-${m}-${d} Received: ${hijri[0]}-${hijri[1]}-${hijri[2]}`)
    }
  })
})
