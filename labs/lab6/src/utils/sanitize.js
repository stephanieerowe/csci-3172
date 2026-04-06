export function sanitizeText(value) {
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
