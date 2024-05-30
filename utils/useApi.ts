export interface RoomListItem {
  _id: string
  name: string
  building: string
}
export type RoomList = RoomListItem[]
export const apiGetRoomList = async () => {
  const { $authorizedApi } = useNuxtApp()
  return await useFetch<RoomList>('/info/rooms', { $fetch: $authorizedApi, server: false })
}

export interface RoomInfo {
  _id: string
  name: string
  building: string
  capacity: number
  area: number
  eating: boolean
}
export const apiGetRoomInfo = async (id: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData<RoomInfo>(() => $authorizedApi('/info/room',
    {
      query: {
        roomId: id
      }
    }),
    {
      pick: ['_id', 'name', 'building', 'capacity', 'area', 'eating']
    })
}