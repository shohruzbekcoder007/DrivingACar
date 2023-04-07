const express = require('express')
const router = express.Router()
const { Condition, validateCondition } = require('../models/condition')
const _ = require('lodash')
const auth = require('../middleware/auth')
const ordinary_user = require('../middleware/ordinary_user')
const admin = require('../middleware/admin')
const tow_truck = require('../middleware/tow_truck')
const newtoken = require('../middleware/newtoken')
const { User } = require('../models/user')
const { Device } = require('../models/device')

router.post('/', [auth, ordinary_user, newtoken], async (req, res) => {

    const { error } = validateCondition(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const condition = new Condition(_.pick(req.body, ['user','device_number', 'status', 'created_at', 'updated_at', 'finished_at']));

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

    const truck_id = req.user._id

    let condition = null;

    if(status == 2){
        condition = await Condition.findByIdAndUpdate(_id, { status: status, updated_at: new Date(), truck:  truck_id}, { new: true })
    }

    if (status == 3) {
        condition = await Condition.findByIdAndUpdate(_id, { status: status, finished_at: new Date() }, { new: true })
    }
    
    return res.send(condition)

})

router.get('/search-condition',[auth, admin, newtoken], async (req, res) => {

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const status = parseInt(req.query.status) || 1;

    try {

        const conditions = await Condition.find({ status: status}).sort({_id: -1}).populate('user').populate('truck').limit(limit).skip((page - 1)*limit)
        const count = await Condition.countDocuments({ status: status})
        const totalPages = Math.ceil(count / limit)

        let result = {}
        result.conditions = conditions
        result.page = page
        result.totalPages = totalPages

        return res.send(result)

    } catch (error) {
        return res.send([])
    }
})

router.get('/done-conditions',[auth, admin, newtoken], async (req, res) => {

    try {
        
        const count = await Condition.countDocuments({ status: 3})

        let result = {
            count
        }

        return res.send(result)

    } catch (error) {
        return res.send({
            count: 0
        })
    }
})

router.get('/result-time',[auth, admin, newtoken], async (req, res)=> {

    const {begin, end} = req.query

    try {

        const condition1 = await Condition.find({created_at: { $gte: begin, $lte: end } }).countDocuments();
        const condition2 = await Condition.find({updated_at: { $gte: begin, $lte: end } }).countDocuments();
        const condition3 = await Condition.find({finished_at: { $gte: begin, $lte: end } }).countDocuments();

        const user1 =  await User.find({status: 3, created_at: { $gte: begin, $lte: end } }).countDocuments();
        const user2 =  await User.find({status: 2, created_at: { $gte: begin, $lte: end } }).countDocuments();
        const device =  await Device.find({ created_at: { $gte: begin, $lte: end } }).countDocuments();

        return res.send({
            condition1,
            condition2,
            condition3,
            user1,
            user2,
            device
        })

    } catch(err){

        return res.send({ error: err })

    }
    
})

module.exports = router;