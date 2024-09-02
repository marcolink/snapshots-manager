import {useContentfulUsers} from "~/hooks/useContentfulUsers";

export function useWithContentfulUsers <T extends {byUser: string}>(data: T[]) {
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError
  } = useContentfulUsers([...new Set(data.map(entry => entry.byUser))])

  const dataWithUsers = data.map(entry => {
      const user = users?.find(user => user.sys.id === entry.byUser)
      return {
        ...entry,
        user
      }
    })

  return {
    data: dataWithUsers,
    users,
    isUsersLoading,
    usersError
  }
}