const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const path = require('path')

const cors = require('cors')
const heads = require('./middleware/headers')

const keys = require('./keys')

const AuthRouter = require('./routes/auth')
const UserRouter = require('./routes/user')
const PostRouter = require('./routes/post')

const app = express()
const store = new MongoStore({
    collection: 'sessions',
    uri: keys.MONGO_URL
})


app.use(express.json())
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    },
    store
}))
app.use(cors({credentials: true, origin: 'http://95.31.196.92:4000'}));
app.use(express.static('public'))
app.use('/auth', AuthRouter)
app.use('/users', UserRouter)
app.use('/posts', PostRouter)
// app.use('/users', PostRouter)




mongoose.set('strictQuery', false)
mongoose.connect(keys.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))

app.listen(3000, () => console.log('App is running on port 3000'))

