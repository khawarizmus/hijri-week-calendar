/// <reference types="@js-temporal/polyfill" />
import type { HWCRepresentation } from '../core/representation'

declare module '@js-temporal/polyfill' {
  namespace Temporal {
    interface PlainDate {
      readonly dayOfHWCDate: number
      readonly HWCRepresentation: HWCRepresentation // Assuming HWCRepresentation is a type you've defined
      readonly hijriDayOfWeek: number
      readonly weeksInYear: number
    }
    interface PlainDateTime {
      readonly dayOfHWCDate: number
      readonly HWCRepresentation: HWCRepresentation // Assuming HWCRepresentation is a type you've defined
      readonly hijriDayOfWeek: number
      readonly weeksInYear: number
    }
    interface ZonedDateTime {
      readonly dayOfHWCDate: number
      readonly HWCRepresentation: HWCRepresentation // Assuming HWCRepresentation is a type you've defined
      readonly hijriDayOfWeek: number
      readonly weeksInYear: number
    }
  }
}
