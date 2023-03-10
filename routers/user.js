const express = require('express')
const router = express.Router()
const { User, validateUser } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const Joi = require('joi')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const newtoken = require('../middleware/newtoken')

const loginValidator = user => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}

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

router.post('/login', async (req, res) => {

    const { error } = loginValidator(_.pick(req.body, ['email', 'password']));
    if(error)
        return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('Email yoki parol noto\'g\'ri');
    
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword)
        return res.status(400).send('Email yoki parol noto\'g\'ri');

    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).send(_.pick(user, ['_id', 'email', 'name', 'device_number', 'status', 'tel_number']));

});

router.get('/users', [auth, admin, newtoken], async (req, res) => {

    const users = await User.find({status: req.query.status}).select('name email tel_number device_number');

    return res.send(users)
});

module.exports = router;