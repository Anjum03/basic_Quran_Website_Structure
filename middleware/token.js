
const Login = require('../model/loginModel');
const jwt = require('jsonwebtoken');


function verifyToken(req, res, next) {

    const token = req.header['authorization'].split(' ')[1]

    if (!token) {
        res.status(403).json({ success: false, msg: `Please Enter a Token` })
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decoded) {
        if (err) {
            console.log(` Failed to authentication token`)
            res.status(404).json({ message: `Failed to authentication token` })
        }

        if (decoded === 'admin') {
            req.admin = decoded;

        } else if (decoded === 'user') {
            req.user = decoded;
        }

        next();
    });

}

function adminToken (req,res,next) {

    if(req.admin && req.admin === 'admin'){
        res.status(200).json({ success: true, msg:` Welcome Admin .. :) `})
        next()
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Only admin allowed.' });
    }

}



module.exports = {
    verifyToken,
    adminToken
}

