export const displayTimeslot = (id: number) => {
  const startHour = 8
  const hour = Math.floor(startHour + id / 2)
  const minute = String((id % 2) * 30).padEnd(2, '0')

  return [hour, minute].join(':')
}
