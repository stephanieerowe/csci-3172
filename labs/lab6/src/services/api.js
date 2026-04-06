import { sanitizeText } from '../utils/sanitize'

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const WEATHER_UNITS = import.meta.env.VITE_OPENWEATHER_UNITS || 'metric'
const FUNCTIONS_BASE = import.meta.env.VITE_FUNCTIONS_BASE || '/.netlify/functions'

export async function fetchProjects() {
  const response = await fetch('/projects.json')

  if (!response.ok) {
    throw new Error('Unable to load projects.')
  }

  return response.json()
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported in this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60_000,
    })
  })
}

export async function fetchWeatherByLocation() {
  if (!WEATHER_API_KEY) {
    throw new Error('OpenWeather API key is missing. Add VITE_OPENWEATHER_API_KEY.')
  }

  const position = await getCurrentPosition()
  const { latitude, longitude } = position.coords

  const endpoint = new URL('https://api.openweathermap.org/data/2.5/weather')
  endpoint.searchParams.set('lat', latitude)
  endpoint.searchParams.set('lon', longitude)
  endpoint.searchParams.set('appid', WEATHER_API_KEY)
  endpoint.searchParams.set('units', WEATHER_UNITS)

  const response = await fetch(endpoint)

  if (!response.ok) {
    throw new Error('Unable to fetch weather information.')
  }

  const data = await response.json()

  return {
    city: data.name,
    temperature: data.main?.temp,
    humidity: data.main?.humidity,
  }
}

export async function submitMessage(formData) {
  const payload = {
    name: sanitizeText(formData.name),
    email: formData.email.trim(),
    subject: sanitizeText(formData.subject),
    message: sanitizeText(formData.message),
  }

  const response = await fetch(`${FUNCTIONS_BASE}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to submit message.')
  }

  return response.json()
}

export async function fetchMessages(accessCode) {
  const response = await fetch(`${FUNCTIONS_BASE}/messages`, {
    headers: {
      'x-access-code': accessCode,
    },
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}))
    throw new Error(errorBody.error || 'Failed to fetch messages.')
  }

  return response.json()
}
