import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate('/', { replace: true })
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [navigate])

  return (
    <section className="text-center py-5">
      <h1 className="display-5">404 - Page Not Found</h1>
      <p className="lead">Redirecting to Home in 3 seconds.</p>
      <Link className="btn btn-primary" to="/">
        Go Home Now
      </Link>
    </section>
  )
}

export default NotFound
