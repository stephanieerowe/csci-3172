import useTheme from '../hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className="btn btn-outline-secondary btn-sm"
      onClick={toggleTheme}
      aria-label="Toggle dark or light mode"
    >
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  )
}

export default ThemeToggle
