const {Router} = require('express')

const UserSchema = require('../models/user')

const router = Router()

app.get('/images/:', (req, res) => {
    if (!req.session.user) return res.status(403).send({error: {message: "Authorization failure"}}).end()
    res.sendFile(path.join(__dirname + '/public/64cd670909afe8a55cb50bec-1691421991900.jpg'))
})


module.exports = router