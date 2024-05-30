interface RoomListItem {
  _id: string
  name: string
  building: string
}

type RoomList = RoomListItem[]
const { $authorizedApi } = useNuxtApp()
export const apiGetRoomList = async () => {
  return await useFetch<RoomList>('/info/rooms', { $fetch: $authorizedApi })
}
