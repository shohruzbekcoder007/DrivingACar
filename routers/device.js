const express = require('express');
const router = express.Router();
const { Device, validateDevice } = require('../models/device');
const _ = require('lodash');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const newtoken = require('../middleware/newtoken');
const { v4: uuidv4 } = require('uuid');

router.post('/',[auth, admin, newtoken], async (req, res) => {

    if (!req.device_number) {
        req.body.device_number = uuidv4();
    }

    const { error } = validateDevice(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const device = new Device(_.pick(req.body, ['name','device_number']));

    await device.save();

    return res.status(201).send(device);
    
});

module.exports = router;