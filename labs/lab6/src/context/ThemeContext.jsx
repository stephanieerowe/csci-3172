import { useEffect, useMemo } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import ThemeContext from './themeContextValue'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('portfolio-theme', 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [theme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
