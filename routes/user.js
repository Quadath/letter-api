const { Router } = require('express')
const UserSchema = require('../models/user')
const router = Router()

router.get('/:username', async (req, res) => {
    const username = req.params.username
    const posts = req.query.posts ? 1 : 0
    const user = await UserSchema.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $project: {
                "password": 0,
                "_id": 0
            }
        }, 
        {
            $set: {
                posts: {
                    $cond: {
                        if: { $eq: [posts, 1]},
                        then: "$posts",
                        else: "$$REMOVE"
                    }
                }
            }
        }
    ])
    if (user == null) {
        res.status(400, {'Content-Type': 'application/json'})
        .end(JSON.stringify({message: "User not found."}))
    }

    res.status(200, {'Content-Type': 'application/json'})
    .end(JSON.stringify(user[0]))
})

router.post('/:username/posts', async (req, res) => {
    const username = req.params.username
    const {text} = req.body;
    console.log(req.session.user)
    const user = await UserSchema.updateOne(
        {_id: req.session.user},
        {"posts": {
            $push: {
                "text": text
            }
        }} 
    ).then((result) => {
        res.status(200, {'Content-Type': 'application/json'})
        .end(JSON.stringify(result))
    })

    
})

router.patch('/:username', async (req, res) => {
    const username = req.params.username
    const {name, bio} = req.body;

    const pipeline = {};

    console.log(req.body)

    if (name) {
        pipeline['name'] = name;
    }
    if (bio) {
        pipeline['bio'] = bio;
    }

    console.log(username)

    UserSchema.updateOne({username}, {
        $set: pipeline
    }).then((result) => {
        console.log(result)
        res.status(200, {'Content-Type': 'application/json'})
        .end(JSON.stringify(result))
    })
})  

router.get('/search/:username', async (req, res) => {
    const username = req.params.username
    if (username.length < 3) {
        res.status(200, {'Content-Type': 'application/json'})
        .end(JSON.stringify({message: 'Query is too short.'}))
    }

    var regex = new RegExp(username, 'd');

    const user = await UserSchema.aggregate([
        {
            $match: {
                username: { $regex: regex }
            }
        },
        {
            $set: {
                "length": {
                    $strLenCP: "$username"
                },
            }
        },
        {
            $sort: {
                "length": 1
            }
        },
        {
            $project: {
                "password": 0,
                "length": 0,
                "posts": 0,
                "bio": 0,
                "_id": 0
            }
        }
    ])
    res.status(200, {'Content-Type': 'application/json'})
    .end(JSON.stringify(user))
})

module.exports = router;