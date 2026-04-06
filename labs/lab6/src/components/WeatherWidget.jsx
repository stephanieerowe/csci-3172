import { useEffect, useState } from 'react'
import { fetchWeatherByLocation } from '../services/api'

function WeatherWidget() {
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadWeather() {
      setStatus('loading')
      setError('')

      try {
        const result = await fetchWeatherByLocation()

        if (!mounted) {
          return
        }

        setWeather(result)
        setStatus('success')
      } catch (loadError) {
        if (!mounted) {
          return
        }

        setError(loadError.message)
        setStatus('error')
      }
    }

    loadWeather()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="card shadow-sm border-0 weather-card">
      <div className="card-body">
        <h2 className="h4">Live Weather</h2>
        {status === 'loading' && <p>Loading local weather...</p>}
        {status === 'error' && (
          <p className="text-danger" role="status">
            {error}
          </p>
        )}
        {status === 'success' && weather && (
          <ul className="list-unstyled mb-0">
            <li>
              <strong>City:</strong> {weather.city}
            </li>
            <li>
              <strong>Temperature:</strong> {Math.round(weather.temperature)} deg C
            </li>
            <li>
              <strong>Humidity:</strong> {weather.humidity}%
            </li>
          </ul>
        )}
      </div>
    </section>
  )
}

export default WeatherWidget
