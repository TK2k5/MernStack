// style react quill

import 'react-quill/dist/quill.snow.css'

import { AuthProvider } from './contexts/auth-context'
import { LanguageProvider } from './contexts/language-context'
import { RootState } from './stores/store'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import { useAppSelector } from './stores/hook'

function App() {
  const { language } = useAppSelector((state: RootState) => state.language)
  const { accessToken } = useAppSelector((state: RootState) => state.auth)

  return (
    <LanguageProvider languageLocal={language}>
      <AuthProvider token={accessToken}>
        <RouterProvider router={routes} />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
