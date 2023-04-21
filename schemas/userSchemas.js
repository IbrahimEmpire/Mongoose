const validator = require("validator")
const mongoose = require("mongoose")

let userSchema = new mongoose.Schema(
    {
        userId: {type: Number, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true,
        lowercase: true,
        validator: (value) =>{
            return validator.isEmail(value)
        }
        },
        mobile: {type: String, default: "000-000-0000"},
        password: {type: String, required: true},
        role: { type: String, default: "mentor"},
        createdAt : {type: Date, default: Date.now}
    },
    {
        collection: "users",
        versionKey: false
    }

)

let userModule = mongoose.model("users", userSchema)
module.exports = {userModule}