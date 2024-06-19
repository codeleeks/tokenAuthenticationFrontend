import { Cookies } from 'react-cookie'

const cookies = new Cookies()

export const setCookie = (key: string, value: string, options?: any) => {
  cookies.set(key, value, { ...options })
}

export const getCookie = (key: string) => {
  const value = cookies.get(key)
  return value === undefined ? '' : value
}

export const removeCookie = (key: string) => {
  cookies.remove(key)
}
