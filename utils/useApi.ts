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
export interface Reservation {
  title: string
  desc: string
  attendants: string[]
  timeSlot: number[]
  rDate: string
  userId: string
  roomId: string
}
export const apiGetReserveInfo = async (meetId: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/reserve', {
      method: 'GET',
      query: {
        meetId: meetId,
      },
    })
  )
}
export const apiCreateReserveInfo = async (
  data: Reservation,
  attachments: FileList
) => {
  const { $authorizedApi } = useNuxtApp()

  const formData = new FormData()
  formData.append('title', data.title)
  formData.append('desc', data.desc)
  formData.append('rDate', data.rDate)
  formData.append('userId', data.userId)
  formData.append('roomId', data.roomId)
  data.attendants.forEach((v) => formData.append('attendants', v))
  data.timeSlot.forEach((v) => formData.append('timeSlot', `${v}`))
  Array.from(attachments).forEach((v) => formData.append('files', v))

  return await useAsyncData(() =>
    $authorizedApi('/info/reserve', {
      method: 'POST',
      body: formData,
    })
  )
}
export type RoomTimeSlot = number
export type RoomTimeSlotsInfo = RoomTimeSlot[]
export interface OccupiedTimeSlotItem {
  _id: string
  meeting: string
  roomId: string
  timeSlot: number
  rDate: string
}
export type OccupiedTimeSlotInfo = OccupiedTimeSlotItem[]
export const apiGetRoomTimeslotInfo = async (roomId: string, rDate: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData<OccupiedTimeSlotInfo>(() =>
    $authorizedApi('/info/room_status', {
      query: {
        roomId: roomId,
        date: rDate,
      },
    })
  )
}
export const apiUpdateReserveInfo = async (
  meetId: string,
  uReserve: Partial<Reservation>
) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/reserve', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      query: {
        meetId: meetId,
      },
      body: uReserve,
    })
  )
}
export const apiGetMeetingsInfo = async () => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/meetings', {
      method: 'GET',
    })
  )
}
export const apiGetMeetingInfo = async (meetId: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/meeting', {
      method: 'GET',
      query: {
        meetId: meetId,
      },
    })
  )
}
export const apiSendMeetingMsg = async (meetId: string, formData: FormData) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/meeting', {
      method: 'GET',
      query: {
        meetId: meetId,
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
  )
}
export const apiCancelMeeting = async (meetId: string) => {
  const { $authorizedApi } = useNuxtApp()
  return await useAsyncData(() =>
    $authorizedApi('/info/reserve', {
      method: 'DELETE',
      query: {
        meetId,
      },
    })
  )
}
