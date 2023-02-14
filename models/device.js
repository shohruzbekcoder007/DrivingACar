const Joi = require('joi')
const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    device_number: {
        type: String,
        required: true,
        unique: true
    },
    created_at: {
        type: Date,
        default: new Date()
    }
});

const Device = mongoose.model('devices', DeviceSchema);

function validateDevice(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        device_number: Joi.string().required()
    });

    return schema.validate(user);
}

exports.Device = Device;
exports.validateDevice = validateDevice;