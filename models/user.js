const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    posts: [
        {
            text: {
                type: String,
                required: true
            },
            time: {
                type: Date,
                default: new Date()
            }
        }
    ]
})

module.exports = model('User', UserSchema)