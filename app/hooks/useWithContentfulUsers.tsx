import {useContentfulUsers} from "~/hooks/useContentfulUsers";
import {UserProps} from "contentful-management";

/**
 * @desc: Since some idiot decided to build this with remix, we need to enrich some data on the client side using the app sdk
 */
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
      } as T & {user: UserProps}
    })

  return {
    data: dataWithUsers,
    users,
    isUsersLoading,
    usersError
  }
}