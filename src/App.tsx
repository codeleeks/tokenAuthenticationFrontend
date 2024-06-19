import { BrowserRouterProvider } from './routes/BrowserRouter'
import { AuthContextProvider } from './store/auth'

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouterProvider />
    </AuthContextProvider>
  )
}

export default App
