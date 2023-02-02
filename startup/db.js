const mongoose = require('mongoose');
const config = require('config');

mongoose.set('strictQuery', true);

module.exports = () => {
    mongoose.connect(config.get('db'), { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('MongoDBga ulanish hosil qilindi...');
        })
        .catch((err) => {
            console.error('MongoDBga ulanish vaqtida xato ro\'y berdi...', err);
        });
}