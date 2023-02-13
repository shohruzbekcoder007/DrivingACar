const express = require('express')
const router = express.Router()
const { Condition, validateCondition } = require('../models/condition')
const _ = require('lodash')
const auth = require('../middleware/auth')
const ordinary_user = require('../middleware/ordinary_user')
const tow_truck = require('../middleware/tow_truck')
const newtoken = require('../middleware/newtoken')

router.post('/', [auth, ordinary_user, newtoken], async (req, res) => {

    const { error } = validateCondition(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const condition = new Condition(_.pick(req.body, ['user','device_number', 'status', 'created_at']));

    await condition.save();
    
    return res.status(201).send(condition)

})

router.post('/create-condition', [auth, ordinary_user, newtoken], async (req, res) => {

    const { _id, device_number } = req.user;

    const user = _id;

    const { error } = validateCondition({ user, device_number });

    if(error)
        return res.status(400).send(error.details[0].message);

    const condition = new Condition({ user, device_number });

    await condition.save();
    
    return res.status(201).send(condition)
    
})

router.post('/update-condition', [auth, tow_truck, newtoken], async (req, res) => {

    const { _id, status } = req.body

    const condition = await Condition.findByIdAndUpdate(_id, { status: status }, { new: true })

    req.app.io.emit('tx', {key:"value"})
    
    return res.send(condition)
    
})

module.exports = router;