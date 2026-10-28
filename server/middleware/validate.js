const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const hits = new Map() // tiny in-memory rate limit: 5 requests / 10 min / IP
export function validateContact(req, res, next) {
  const now = Date.now(), ip = req.ip
  const recent = (hits.get(ip) || []).filter(t => now - t < 600000)
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: 'Too many messages. Try again later.' })
  hits.set(ip, [...recent, now])
  const { name = '', email = '', message = '' } = req.body || {}
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Enter your name.'
  if (!EMAIL.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (message.trim().length < 10) errors.message = 'Write at least 10 characters.'
  if (message.length > 2000) errors.message = 'Keep it under 2000 characters.'
  if (Object.keys(errors).length) return res.status(422).json({ ok: false, errors })
  req.clean = { name: name.trim(), email: email.trim(), message: message.trim() }
  next()
}
