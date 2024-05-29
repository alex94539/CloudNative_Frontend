import { skipHydrate } from 'pinia'
export type Role = 'Admin' | 'User' | null
interface UserData {
  username: string
  role: Role
}

export const useUserStore = defineStore('user', () => {
  const _localData = useLocalStorage(
    'user',
    { username: '', role: null } as UserData,
    { writeDefaults: false }
  )
  const _sessionData = useSessionStorage(
    'user',
    { username: '', role: null } as UserData,
    { writeDefaults: false }
  )

  const data = computed(() => {
    if (
      _sessionData.value.username !== '' &&
      _sessionData.value.role !== null
    ) {
      const ret = _sessionData.value
      return ret
    } else {
      return _localData.value
    }
  })

  function set(data: UserData, isLocalStorage = false) {
    if (isLocalStorage) {
      _localData.value = data
    } else {
      _sessionData.value = data
    }
  }

  function clear() {
    _localData.value = null
    _sessionData.value = null
  }

  return {
    role: skipHydrate(_localData),
    username: skipHydrate(_sessionData),
    data,
    set,
    clear,
  }
})
