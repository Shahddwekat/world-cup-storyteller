// Converts an "H:MM AM/PM ET" string to Saudi Arabia time (UTC+3, no DST).
// Eastern Time during the World Cup is EDT (UTC-4), so Saudi is 7 hours ahead.
export function convertETtoSaudi(timeStr) {
  const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i)
  if (!match) return null

  let [, hourStr, minuteStr, period] = match
  let hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)
  if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (period.toUpperCase() === 'AM' && hour === 12) hour = 0

  let saudiHour = hour + 7
  let dayOffset = 0
  if (saudiHour >= 24) {
    saudiHour -= 24
    dayOffset = 1
  }

  const newPeriod = saudiHour >= 12 ? 'PM' : 'AM'
  let displayHour = saudiHour % 12
  if (displayHour === 0) displayHour = 12

  const minuteDisplay = minute.toString().padStart(2, '0')
  const dayLabel = dayOffset === 1 ? ' (+1 day)' : ''

  return `${displayHour}:${minuteDisplay} ${newPeriod} Saudi${dayLabel}`
}