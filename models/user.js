const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        min : 5
    },
    username: {
        type: String,
        required: true,
        min: 6
    },
    bio: {
        type: String,
        default: ''
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