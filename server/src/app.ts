import express from 'express'
import session from 'express-session'

import passport from './libs/passport'
import { corsMiddleware, loggerMiddleware } from './libs/middleware'

import authRouter from './routes/auth'
import protectRouter from './routes/protect'
import publicRouter from './routes/public'
import socialRouter from './routes/social'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    secure: false, // Change to true to enforce HTTPS protocol.
    sameSite: true
  }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(loggerMiddleware)
app.use(corsMiddleware)

app.get('/', (req, res) => {
  res.send(`Corner API accepting requests from origins: ${process.env.ALLOWED_ORIGINS}`)
})

app.use('/static', express.static('static'))
app.use('/auth', authRouter)
app.use('/public', publicRouter)
app.use('/protect', protectRouter)
app.use('/social', socialRouter)

app.listen(process.env.PORT || 8000, () => {
  console.log(`The server is listening on port ${process.env.PORT || 8000}!`)
})