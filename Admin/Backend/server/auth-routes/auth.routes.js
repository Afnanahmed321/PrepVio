import express from 'express'
import { auth, oauth2callback, revoke, verify } from '../auth-Controllers/authController.js'

const authrouter = express.Router()

authrouter.get('/auth/google', auth)
authrouter.get('/oauth2callback', oauth2callback)
authrouter.get('/revoke', revoke)
authrouter.get('/verify', verify)

export default authrouter
