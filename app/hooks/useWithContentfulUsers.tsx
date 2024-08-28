import {useContentfulUsers} from "~/hooks/useContentfulUsers";
import {useMemo} from "react";

export function useWithContentfulUsers <T extends {byUser: string}>(data: T[]) {
  const {
    value: users,
    loading: isUsersLoading,
    error: usersError
  } = useContentfulUsers([...new Set(data.map(entry => entry.byUser))])

  const dataWithUsers = useMemo(() => {
    return data.map(entry => {
      const user = users?.find(user => user.sys.id === entry.byUser)
      return {
        ...entry,
        user
      }
    })
  }, [users?.toString(), data.toString()])

  return {
    data: dataWithUsers,
    users,
    isUsersLoading,
    usersError
  }
}