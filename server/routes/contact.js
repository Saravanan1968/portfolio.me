import { Router } from 'express'
import { validateContact } from '../middleware/validate.js'
import { createMessage } from '../controllers/contact.js'
const r = Router()
r.post('/', validateContact, createMessage)
export default r
