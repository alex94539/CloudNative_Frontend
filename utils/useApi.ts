export interface RoomListItem {
  _id: string
  name: string
  building: string
}
export type RoomList = RoomListItem[]
export const apiGetRoomList = async () => {
  const { $authorizedApi } = useNuxtApp()
  return await useFetch<RoomList>('/info/rooms', {
    $fetch: $authorizedApi,
    server: false,
  })
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
  return await useAsyncData<RoomInfo>(
    () =>
      $authorizedApi('/info/room', {
        query: {
          roomId: id,
        },
      }),
    {
      pick: ['_id', 'name', 'building', 'capacity', 'area', 'eating'],
    }
  )
}
export const apiPatchRoomInfo = async (data: RoomInfo) => {
  const { $authorizedApi } = useNuxtApp()
  const roomId = data._id
  const { _id, ...body } = data

  return await useAsyncData(() =>
    $authorizedApi('/info/room', {
      method: 'PATCH',
      body,
      query: {
        roomId,
      },
    })
  )
}
export const apiCreateRoomInfo = async (data: Omit<RoomInfo, '_id'>) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/room', {
      method: 'POST',
      body: data,
    })
  )
}

export interface UserListItem {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  role: 'Admin' | 'User'
}
export interface UserListResponse extends UserListItem {
  _id: string
  __v: string
}
export const apiGetUserList = async () => {
  const { $authorizedApi } = useNuxtApp()
  return await useFetch<UserListResponse[]>('/user/users', {
    $fetch: $authorizedApi,
    server: false,
  })
}
export const apiGetUserInfo = async (userId: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/user/user', {
      query: {
        userId,
      },
    })
  )
}
export const apiCreateUserInfo = async (body: UserListItem) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/user/user', {
      method: 'POST',
      body,
    })
  )
}
