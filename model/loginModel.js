

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: {type:String, enum:['user', 'admin'], default: 'user', }
}, { timestamps : true }
);


module.exports = mongoose.model('Login', loginSchema);
