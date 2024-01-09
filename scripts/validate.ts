import process from 'node:process'
import { dataValidator } from './validator'

// SIGINT handler
process.on('SIGINT', () => {
  console.log('Interrupt detected. Exiting the process...')
  process.exit(0)
})

await dataValidator()
