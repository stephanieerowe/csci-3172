import { getStore } from '@netlify/blobs'

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-access-code',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

const accessCode = process.env.MESSAGES_ACCESS_CODE || 'portfolio-admin'

let fallbackMessages = []

function sanitize(value) {
  if (typeof value !== 'string') {
    return ''
  }

  const withoutControls = value
    .split('')
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join('')

  return withoutControls
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

function validateName(value) {
  return /^[A-Za-z][A-Za-z\s'-]{1,49}$/.test(value)
}

function validateSubject(value) {
  return /^[A-Za-z\s]{3,100}$/.test(value)
}

async function readMessages(store) {
  if (!store) {
    return fallbackMessages
  }

  const existing = await store.get('messages', { type: 'json' })
  return Array.isArray(existing) ? existing : []
}

async function saveMessages(store, messages) {
  if (!store) {
    fallbackMessages = messages
    return
  }

  await store.setJSON('messages', messages)
}

function getStoreSafely() {
  try {
    return getStore({ name: 'messages' })
  } catch {
    return null
  }
}

export default async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    }
  }

  const store = getStoreSafely()

  if (event.httpMethod === 'GET') {
    const providedCode = event.headers['x-access-code'] || event.headers['X-Access-Code']

    if (providedCode !== accessCode) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized access.' }),
      }
    }

    const messages = await readMessages(store)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ messages }),
    }
  }

  if (event.httpMethod === 'POST') {
    let payload

    try {
      payload = JSON.parse(event.body || '{}')
    } catch {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON body.' }),
      }
    }

    const message = {
      id: crypto.randomUUID(),
      name: sanitize(payload.name),
      email: sanitize(payload.email),
      subject: sanitize(payload.subject),
      message: sanitize(payload.message),
      createdAt: new Date().toISOString(),
    }

    if (
      !validateName(message.name) ||
      !validateEmail(message.email) ||
      !validateSubject(message.subject) ||
      message.message.length < 10
    ) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: 'Message failed validation checks.' }),
      }
    }

    const messages = await readMessages(store)
    messages.unshift(message)
    await saveMessages(store, messages)

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({ ok: true, message }),
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed.' }),
  }
}
