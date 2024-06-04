export const displayTimeslot = (id: number) => {
  const startHour = 8
  const hour = Math.floor(startHour + id / 2)
  const minute = String((id % 2) * 30).padEnd(2, '0')

  return [hour, minute].join(':')
}

export const formatDateString = (date: Date) => {
  // Get UTC+8 date
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .slice(0, 10)
}