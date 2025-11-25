import { AuthContextProvider } from './context/AuthContext'
import { Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <AuthContextProvider>
        <Outlet/>
    </AuthContextProvider>
  )
}
