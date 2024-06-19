import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { getCookie, removeCookie, setCookie } from '../cookie/cookie'
import { useNavigate } from 'react-router-dom'

// Cookies
const REFRESH_TOKEN_KEY = 'refreshToken'
const ACCESS_TOKEN_KEY = 'accessToken'

function numberToDate(min: number) {
  const dt = new Date()
  dt.setSeconds(dt.getSeconds() + min)
  return dt
}

function storeAuth(refreshToken: string, accessToken: string) {
  setCookie(REFRESH_TOKEN_KEY, refreshToken, {
    path: '/',
    expires: numberToDate(10),
  })
  setCookie(ACCESS_TOKEN_KEY, accessToken, {
    path: '/',
    expires: numberToDate(3),
  })
}

function removeAuth() {
  removeCookie(REFRESH_TOKEN_KEY)
  removeCookie(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_KEY)
}

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_KEY)
}

function isAuthenticatedOnReload() {
  const refreshToken = getCookie(REFRESH_TOKEN_KEY)
  return refreshToken === '' ? undefined : true
}

// Fetch

const url = 'http://localhost:8080'
async function fetchLogin(email: string, password: string) {
  try {
    const resp = await fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!resp.ok) {
      return null
    }

    return {
      refreshToken: resp.headers.get('x-refresh-token'),
      accessToken: resp.headers.get('x-access-token'),
    }
  } catch (e) {
    console.error(e)
  }
}

async function fetchLogout() {
  const resp = await fetch(`${url}/logout`, {
    method: 'POST',
    headers: {
      'x-refresh-token': getRefreshToken(),
      'x-access-token': getAccessToken(),
    },
  })
  if (!resp.ok) {
    return null
  }

  return true
}


export async function fetchWithAuth(
  sub: string,
  options?: any,
  step: number = 0
) {
  const fetchOption = { ...options }
  fetchOption.headers = {
    ...fetchOption.headers,
    'x-refresh-token': getRefreshToken(),
    'x-access-token': getAccessToken(),
  }

  const resp = await fetch(`${url}/${sub}`, {
    method: 'GET',
    headers: {
      'x-refresh-token': getRefreshToken(),
      'x-access-token': getAccessToken(),
    },
  })
  if (!resp.ok) {
    if (step < 1) {
      const token = await refreshAuth()
      if (token && token.refreshToken && token.accessToken) {
        storeAuth(token.refreshToken, token.accessToken)
        return await fetchWithAuth(sub, options, step + 1)
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return await resp.json()
}

export async function refreshAuth() {
  const resp = await fetch(`${url}/refresh`, {
    method: 'POST',
    headers: {
      'x-refresh-token': getRefreshToken(),
    },
  })

  if (!resp.ok) {
    return null
  }

  return {
    refreshToken: resp.headers.get('x-refresh-token'),
    accessToken: resp.headers.get('x-access-token'),
  }
}

// Context
const authContext = createContext({
  isAuthenticated: isAuthenticatedOnReload(),
  setIsAuth: (_: boolean | undefined) => {},
  login: (_: string, __: string) => {},
  logout: () => {},
})

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [isAuth, setIsAuth] = useState(isAuthenticatedOnReload())

  const login = async (email: string, password: string) => {
    console.debug('login')
    const token = await fetchLogin(email, password)
    if (token && token.refreshToken && token.accessToken) {
      setIsAuth(true)
      storeAuth(token.refreshToken, token.accessToken)
    } else {
      setIsAuth(false)
    }
  }

  const logout = async () => {
    console.debug('logout')
    await fetchLogout()
    setIsAuth(undefined)
    removeAuth()
  }

  const value = {
    isAuthenticated: isAuth,
    setIsAuth,
    login,
    logout,
  }
  return <authContext.Provider value={value}>{children}</authContext.Provider>
}

export function useAuthContext() {
  return useContext(authContext)
}

export function AuthNeccessaryPage({ children }: { children: ReactNode }) {
  const authCtx = useAuthContext()
  const isAuthenticated = authCtx.isAuthenticated && isAuthenticatedOnReload()
  const setIsAuth = authCtx.setIsAuth
  const navigate = useNavigate()
  useEffect(() => {
    console.debug('refreshed! - ', isAuthenticated)
    if (!isAuthenticated) {
      setIsAuth(isAuthenticated)
      navigate('/signin')
    }
  }, [isAuthenticated, setIsAuth])
  return <>{children}</>
}
