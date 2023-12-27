
/**
 * Converts the ISO day of the week to the corresponding Hijri day of the week.
 * 
 * @param dayOfWeek The ISO day of the week, where Monday is represented as 1 and Sunday is represented as 7.
 * @returns The Hijri day of the week, where Saturday is represented as 1 and Friday is represented as 7.
 */
export function hijriDayOfWeek(dayOfWeek: number): number {
    return (dayOfWeek + 2) % 7 || 7;
}