import { useAuthContext } from '../store/auth'

const HomePage = () => {
  const ctx = useAuthContext()
  return (
    <section>
      <h2
        onClick={() => {
          ctx.logout()
        }}
      >
        Home Page
      </h2>
      {ctx.isAuthenticated && <h3>{`user A is logged in`}</h3>}
    </section>
  )
}

export default HomePage
