const Joi = require('joi')
const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
    device_number: {
        type: String,
        required: true,
    }
});

const Device = mongoose.model('devices', DeviceSchema);

function validateDevice(user) {
    const schema = Joi.object({
        device_number: Joi.string().required()
    });

    return schema.validate(user);
}

exports.Device = Device;
exports.validateDevice = validateDevice;