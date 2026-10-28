import { appendFile } from 'node:fs/promises'
// Stores messages in messages.jsonl. Swap this for nodemailer/Resend when you deploy.
export async function createMessage(req, res) {
  try {
    await appendFile('messages.jsonl', JSON.stringify({ ...req.clean, at: new Date().toISOString() }) + '\n')
    res.status(201).json({ ok: true, message: 'Message sent.' })
  } catch {
    res.status(500).json({ ok: false, error: 'Could not save your message. Email me directly.' })
  }
}
