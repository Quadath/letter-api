const { Router } = require('express')
const UserSchema = require('../models/user')
const router = Router()

router.get('/:id', async (req, res) => {
    console.log(req.session.user)
    const id = req.params.id
    console.log(id)

    const user = await UserSchema.findById(id).select('-password')

    res.send(user)
})

module.exports = router;