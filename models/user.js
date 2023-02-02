const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    status: {
        type: String,
        enum: [1,2,3],
        required: false,
    },
    tel_number: {
        type: String,
        required: true,
    },
    // device_number: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "devices",
    //     required: true,
    // }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, status: this.status }, config.get('jwtPrivateKey'),
        // {expiresIn: '300s'}
    );
    return token;
}

const User = mongoose.model('users', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        status: Joi.number(),
        tel_number: Joi.string().min(9).max(13).required(),
        // device_number: Joi.string().min(3).max(50).required()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;