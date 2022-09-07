const mongoose = require('mongoose');
async function connect() {
    try {
        //mongodb://127.0.0.1:27017/JoinMe
        //mongodb+srv://danghuynh:664JsP2Xf0yPk5E1@cluster0.ky9yrsr.mongodb.net/JoinMe
        await mongoose.connect('mongodb://127.0.0.1:27017/ProjectManagement', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect database success!!!');
    } catch (error) {
        console.log('connect database fail!!! ', error);
    }
}

module.exports = { connect };
