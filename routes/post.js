const { Router } = require('express')
const UserSchema = require('../models/user')
const router = Router()

router.get('/', async (req, res) => {
    console.log(req.session.user)
})

module.exports = router;