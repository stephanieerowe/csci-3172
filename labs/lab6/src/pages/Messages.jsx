import { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { fetchMessages } from '../services/api'

const defaultCode = import.meta.env.VITE_MESSAGES_ACCESS_CODE || 'portfolio-admin'

function Messages() {
  const [accessCode, setAccessCode] = useState('')
  const [authorized, setAuthorized] = useLocalStorage('portfolio-messages-auth', false)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authorized) {
      return
    }

    let mounted = true

    async function loadMessages() {
      setStatus('loading')
      setError('')

      try {
        const result = await fetchMessages(defaultCode)

        if (!mounted) {
          return
        }

        setMessages(result.messages ?? [])
        setStatus('success')
      } catch (loadError) {
        if (!mounted) {
          return
        }

        setError(loadError.message)
        setStatus('error')
      }
    }

    loadMessages()

    return () => {
      mounted = false
    }
  }, [authorized])

  function handleUnlock(event) {
    event.preventDefault()

    if (accessCode.trim() === defaultCode) {
      setAuthorized(true)
      setError('')
      return
    }

    setError('Access code is incorrect.')
  }

  if (!authorized) {
    return (
      <section className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h1 className="h3">Messages (Protected View)</h1>
              <p className="mb-3">Enter the access code to view submitted messages.</p>
              <form className="d-flex gap-2" onSubmit={handleUnlock}>
                <label htmlFor="accessCode" className="visually-hidden">
                  Access code
                </label>
                <input
                  id="accessCode"
                  className="form-control"
                  type="password"
                  value={accessCode}
                  onChange={(event) => setAccessCode(event.target.value)}
                />
                <button className="btn btn-dark" type="submit">
                  Unlock
                </button>
              </form>
              {error && <p className="text-danger mt-2 mb-0">{error}</p>}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h2 mb-0">Submitted Messages</h1>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => setAuthorized(false)}>
          Lock
        </button>
      </div>

      {status === 'loading' && <p>Loading messages...</p>}
      {status === 'error' && <p className="text-danger">{error}</p>}

      {status === 'success' && (
        <div className="row g-3">
          {messages.length === 0 && <p>No messages submitted yet.</p>}
          {messages.map((message) => (
            <article className="col-md-6" key={message.id}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h2 className="h5">{message.subject}</h2>
                  <p className="mb-1">
                    <strong>Name:</strong> {message.name}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {message.email}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-0">{message.message}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default Messages
