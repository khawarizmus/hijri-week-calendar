import { Temporal } from '@js-temporal/polyfill'
import ms from 'ms'
import prettyBytes from 'pretty-bytes'
import ora from 'ora'
import type { Answers } from 'prompts'
import prompts from 'prompts'
import kluer from 'kleur'
import { toHWCDate } from '../src/core/core'
import type { SupportedHijriCalendars } from '../src/types'
import { storage } from './store'

// TODO: insert license header here

const START_YEAR = await storage.getItem<number>('START_YEAR')
const END_YEAR = await storage.getItem<number>('END_YEAR')

console.log(kluer.green('Hijri Week Calendar Data Generator\n'))
console.log(kluer.yellow('------------------------------------\n'))
if (START_YEAR && END_YEAR)
  console.log(kluer.green(`Previously generated data from year AH ${kluer.yellow(START_YEAR)} to AH ${kluer.yellow(END_YEAR)} is available.`))

const useExisting = await prompts({
  type: (START_YEAR && END_YEAR) ? 'confirm' : null,
  initial: !((START_YEAR && END_YEAR)), // if data is undefined then useExisting is true
  name: 'value',
  hint: kluer.yellow('Previously generated data will be overwritten.'),
  message: 'Do You want to use the existing data?',
})

let doValidate: Answers<'value'> = {
  value: false,
}

if (!useExisting.value) {
  doValidate = await prompts({
    type: 'confirm',
    initial: true,
    name: 'value',
    message: 'Do You want to validate the generated data?',
  })

  await prompts({
    type: 'number',
    initial: 1443,
    name: 'value',
    message: 'Enter the Hijri start year',
    validate: (value: number) => value >= -99999 && value <= 999999,
    onState: (state) => {
      if (!state.aborted)
        storage.setItem('START_YEAR', state.value)
    },
  })

  await prompts({
    type: 'number',
    initial: 1444,
    name: 'value',
    message: 'Enter the Hijri end year',
    validate: (value: number) => value >= -99999 && value <= 999999,
    onState: (state) => {
      if (!state.aborted)
        storage.setItem('END_YEAR', state.value)
    },
  })

  // await prompts({
  //   type: 'autocomplete',
  //   initial: 'islamic-umalqura',
  //   name: 'value',
  //   message: 'Select the which Hijri calendar',
  //   choices: [
  //     { title: 'islamic-umalqura', description: 'Umm al-Qura Astronomical calendar', value: 'islamic-umalqura' },
  //     { title: 'islamic-civil', description: 'Tabular calendar based Friday epoch', value: 'islamic-civil' },
  //     { title: 'islamic-tbla', description: 'Tabular calendar based on Thursday epoch', value: 'islamic-tbla' },
  //     { title: 'islamic', description: 'Arithmetic calendar based on Gregorian', value: 'islamic', disabled: true },
  //     { title: 'islamic-rgsa', description: 'Regional Sighting Saudi Arabia', value: 'islamic-rgsa', disabled: true },
  //   ],
  // })
}

export async function dataGenerator() {
  if (useExisting.value) {
    // return existing data
    const umalqura = await storage.getItem<any[]>('dates:islamic-umalqura')
    const civil = await storage.getItem<any[]>('dates:islamic-civil')
    const tbla = await storage.getItem<any[]>('dates:islamic-tbla')
    const START_YEAR = await storage.getItem<number>('START_YEAR')
    const END_YEAR = await storage.getItem<number>('END_YEAR')
    return {
      umalqura,
      civil,
      tbla,
      START_YEAR,
      END_YEAR,
    }
  }
  else {
    const START_YEAR = await storage.getItem<number>('START_YEAR')
    const END_YEAR = await storage.getItem<number>('END_YEAR')

    if (!START_YEAR || !END_YEAR)
      throw new Error('Start and End years are not defined')
    // generate data
    const spinner = ora({
      text: `Generating Hijri Week Calendar dates. estimate ${ms((END_YEAR - START_YEAR) * 1027 / 10)}\n`,
      spinner: 'moon',
    }).start()

    console.time('DataGenerator Execution Time') // Start timing
    const calendars: SupportedHijriCalendars[] = ['islamic-umalqura', 'islamic-civil', 'islamic-tbla']
    const umalqura = []
    const civil = []
    const tbla = []

    for (let i = 0; i < calendars.length; i++) {
      const calendar = calendars[i]
      const data = []
      for (let year = START_YEAR; year <= END_YEAR; year++) {
        spinner.clear()
        spinner.text = `Generating dates for year ${kluer.yellow(`AH ${year}`)} for ${kluer.yellow(calendar)}\n`
        spinner.render()
        for (let month = 1; month <= 12; month++) {
          const daysInMonth = Temporal.PlainYearMonth.from({ year, month, calendar }).daysInMonth
          for (let day = 1; day <= daysInMonth; day++) {
            const date = [year, month, day]
            const hwcDate = toHWCDate(year, month, day, calendar)
            data.push([...date, ...hwcDate])
          }
        }
      }
      storage.setItem(`dates:${calendar}`, data)
      switch (calendar) {
        case 'islamic-umalqura':
          umalqura.push(...data)
          break
        case 'islamic-civil':
          civil.push(...data)
          break
        case 'islamic-tbla':
          tbla.push(...data)
          break
      }
    }

    const sizeInBytes = new Blob([JSON.stringify(umalqura)]).size + new Blob([JSON.stringify(civil)]).size + new Blob([JSON.stringify(tbla)]).size
    spinner.info(`List size approx = ${kluer.yellow(prettyBytes(sizeInBytes))} bytes\n`)
    // store data
    storage.setItem('START_YEAR', START_YEAR)
    storage.setItem('END_YEAR', END_YEAR)
    console.timeEnd('DataGenerator Execution Time') // End timing and log the duration
    spinner.succeed(kluer.green(`Data generated successfully`))
    return {
      umalqura,
      civil,
      tbla,
      START_YEAR,
      END_YEAR,
    }
  }
}

await dataGenerator()

if (doValidate) {
  // TODO: add validator
}
