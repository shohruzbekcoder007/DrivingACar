const express = require('express')
const router = express.Router()
const { Device, validateDevice } = require('../models/device')
const { User } = require('../models/user')
const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')
const { v4: uuidv4 } = require('uuid')

router.post('/', [auth, admin, newtoken], async (req, res) => {

    if (req.body.device_number == undefined) {
        req.body.device_number = uuidv4();
    } else {

        const drive = await Device.findOne({ device_number: req.body.device_number})
        if (drive)
            return res.status(400).send('Mavjud bo\'lgan device');
    }

    const { error } = validateDevice(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const device = new Device(_.pick(req.body, ['name','device_number']));

    await device.save();

    return res.status(201).send(device);
    
});

router.delete('/remove', [auth, admin, newtoken], async (req, res) => {

    const { _id } = _.pick(req.body, ['_id'])
    
    let user = await Device.findByIdAndRemove(_id);
    if (!user)
        return res.status(400).send('Device is not remove');

    return res.send(_.pick(user, ['name','device_number']));
});

router.get('/devices', [auth, admin, newtoken], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
  
    try {
        const devices = await Device.find().limit(limit).skip(offset)
        return res.send(devices)
    } catch (error) {
        return res.send([])
    }

});

router.post('/login', async (req, res) => {
    
    let user = await User.findOne({ device_number: req.body.device_number});
    if (!user)
        return res.status(400).send({connected: false});

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send({connected: true});
    
});

module.exports = router;