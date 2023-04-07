const Joi = require('joi')
const mongoose = require('mongoose')

const ConditionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    truck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
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
    },
    updated_at: {
        type: Date,
        default: null
    },
    finished_at: {
        type: Date,
        default: null
    }
});

const Condition = mongoose.model('conditions', ConditionSchema);

function validateCondition(condition) {
    const schema = Joi.object({
        user: Joi.string().required(),
        device_number: Joi.string().required(),
        truck: Joi.string(),
        status: Joi.number(),
        created_at: Joi.date(),
        updated_at: Joi.date(),
        finished_at: Joi.date()
    });

    return schema.validate(condition);
}

exports.Condition = Condition;
exports.validateCondition = validateCondition;