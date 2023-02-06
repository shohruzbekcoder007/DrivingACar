const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

router.post('/', async (req, res) => {
    try{
        const { error } = validateUser(req.body);

        if(error)
            return res.status(400).send(error.details[0].message);

        let user = await User.findOne({ email: req.body.email });

        if (user)
            return res.status(400).send('Mavjud bo\'lgan foydalanuvchi');

        user = new User(_.pick(req.body, ['name', 'email', 'password', 'status', 'tel_number', 'device_number']));
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        return res.header('x-auth-token', token).send(_.pick(user, ['name', 'email', 'status', 'tel_number', 'device_number']));
    }catch{
        return res.status(500).send("xatolik yuzaga keldi")
    }
});

module.exports = router;