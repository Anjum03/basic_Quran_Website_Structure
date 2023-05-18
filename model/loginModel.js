

const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    email: {type: String},
    password: {type: String,min: 8,},
    role: {type:String, enum:['user', 'admin'], default: 'user', }
}, { timestamps : true }
);


module.exports = mongoose.model('Login', loginSchema);
