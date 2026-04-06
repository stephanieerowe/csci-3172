import { describe, expect, it } from 'vitest'
import { sanitizeText } from '../utils/sanitize'
import {
  getFormErrors,
  validateEmail,
  validateMessage,
  validateName,
  validateSubject,
} from '../utils/validation'

describe('validation utilities', () => {
  it('validates name, subject, and email formats', () => {
    expect(validateName('Stephanie Rowe')).toBe(true)
    expect(validateName('12 Stephanie')).toBe(false)
    expect(validateSubject('Project Inquiry')).toBe(true)
    expect(validateSubject('Project 2026')).toBe(false)
    expect(validateEmail('student@dal.ca')).toBe(true)
    expect(validateEmail('bad-email')).toBe(false)
  })

  it('sanitizes text and validates message length', () => {
    expect(sanitizeText('<script>alert(1)</script> Hello')).toBe('alert(1) Hello')
    expect(validateMessage('Too short')).toBe(false)
    expect(validateMessage('This message is long enough')).toBe(true)
  })

  it('returns form errors for invalid data', () => {
    const errors = getFormErrors({
      name: '1',
      email: 'invalid',
      subject: 'Hey1',
      message: 'small',
      consent: false,
    })

    expect(errors).toHaveProperty('name')
    expect(errors).toHaveProperty('email')
    expect(errors).toHaveProperty('subject')
    expect(errors).toHaveProperty('message')
    expect(errors).toHaveProperty('consent')
  })
})
