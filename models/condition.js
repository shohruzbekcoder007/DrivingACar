const Joi = require('joi')
const mongoose = require('mongoose')

const ConditionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    device_number: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [1,2,3],
        default: 1
    },
    created_at: {
        type: Date,
        default: new Date()
    }
});

const Condition = mongoose.model('conditions', ConditionSchema);

function validateCondition(condition) {
    const schema = Joi.object({
        user: Joi.string().required(),
        device_number: Joi.string().required(),
        status: Joi.number(),
        created_at: Joi.date()
    });

    return schema.validate(condition);
}

exports.Condition = Condition;
exports.validateCondition = validateCondition;