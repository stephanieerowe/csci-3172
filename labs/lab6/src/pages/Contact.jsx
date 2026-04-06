import { useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { submitMessage } from '../services/api'
import { sanitizeText } from '../utils/sanitize'
import { getFormErrors } from '../utils/validation'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
}

function Contact() {
  const [formData, setFormData] = useLocalStorage('portfolio-contact-draft', initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errors = useMemo(() => getFormErrors(formData), [formData])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setSubmitted(false)
    setRequestError('')
    setFormData((prev) => ({ ...prev, [name]: nextValue }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const currentErrors = getFormErrors(formData)
    if (Object.keys(currentErrors).length > 0) {
      setSubmitted(true)
      return
    }

    setIsSubmitting(true)
    setRequestError('')

    try {
      await submitMessage({
        ...formData,
        message: sanitizeText(formData.message),
      })

      setFormData(initialForm)
      localStorage.removeItem('portfolio-contact-draft')
      setSubmitted(true)
    } catch (error) {
      setRequestError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function invalidClass(field) {
    return submitted && errors[field] ? 'is-invalid' : ''
  }

  const isDisabled = !formData.consent || isSubmitting

  return (
    <section className="row justify-content-center">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h1 className="h2 mb-3">Contact</h1>
            <p className="mb-4">Submit your inquiry. Draft data is saved automatically.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  className={`form-control ${invalidClass('name')}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {submitted && errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  className={`form-control ${invalidClass('email')}`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {submitted && errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input
                  id="subject"
                  className={`form-control ${invalidClass('subject')}`}
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {submitted && errors.subject && (
                  <div className="invalid-feedback">{errors.subject}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  className={`form-control ${invalidClass('message')}`}
                  rows="5"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                />
                {submitted && errors.message && (
                  <div className="invalid-feedback">{errors.message}</div>
                )}
              </div>

              <div className="form-check mb-3">
                <input
                  id="consent"
                  className={`form-check-input ${invalidClass('consent')}`}
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                />
                <label htmlFor="consent" className="form-check-label">
                  I consent to storing this message.
                </label>
                {submitted && errors.consent && (
                  <div className="text-danger small mt-1">{errors.consent}</div>
                )}
              </div>

              <button className="btn btn-primary" type="submit" disabled={isDisabled}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>

            {submitted && Object.keys(errors).length === 0 && !requestError && (
              <p className="text-success mt-3 mb-0" role="status">
                Message submitted successfully.
              </p>
            )}
            {requestError && (
              <p className="text-danger mt-3 mb-0" role="alert">
                {requestError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
