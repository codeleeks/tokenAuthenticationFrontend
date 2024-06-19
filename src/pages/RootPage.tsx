import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AuthNeccessaryPage, useAuthContext } from '../store/auth'

const noAuthPage = ["/"]

const RootPage = () => {
  const authCtx = useAuthContext()
  const { pathname } = useLocation()

  const onSignOut = () => {
    authCtx.logout()
  }

  const isAuthPage = !noAuthPage.includes(pathname)

  return (
    <>
      <nav>
        <NavLink to=''>Home</NavLink>
        <NavLink to='items'>Items</NavLink>
        {!authCtx.isAuthenticated && <NavLink to='signin'>SignIn</NavLink>}
        {authCtx.isAuthenticated && (
          <button onClick={onSignOut}>SignOut</button>
        )}
      </nav>

      {isAuthPage && (
        <AuthNeccessaryPage key={pathname}>
          <Outlet />
        </AuthNeccessaryPage>
      )}
      {!isAuthPage && <Outlet />}
    </>
  )
}

export default RootPage
