import { sanitizeText } from './sanitize'

const nameRegex = /^[A-Za-z][A-Za-z\s'-]{1,49}$/
const subjectRegex = /^[A-Za-z\s]{3,100}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function validateName(value) {
  return nameRegex.test(sanitizeText(value))
}

export function validateSubject(value) {
  return subjectRegex.test(sanitizeText(value))
}

export function validateEmail(value) {
  return emailRegex.test(value.trim())
}

export function validateMessage(value) {
  return sanitizeText(value).length >= 10
}

export function getFormErrors(formData) {
  const errors = {}

  if (!validateName(formData.name)) {
    errors.name = 'Enter a valid name (letters, spaces, apostrophes, hyphens).'
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (!validateSubject(formData.subject)) {
    errors.subject = 'Subject must include letters only.'
  }

  if (!validateMessage(formData.message)) {
    errors.message = 'Message must be at least 10 characters.'
  }

  if (!formData.consent) {
    errors.consent = 'You must consent before submitting.'
  }

  return errors
}
