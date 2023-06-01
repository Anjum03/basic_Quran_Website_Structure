
require('dotenv').config();
const router = require("express").Router();
const { token } = require('morgan');
const DeviceToken = require('../model/deviceModel');
const jwt = require('jsonwebtoken');



// register 

router.post('/register', async (req, res) => {
    try {

        const { deviceToken } = req.body;

        const existDeviceToken = await DeviceToken.create({
            deviceToken: deviceToken
        })
        jwt.sign({ _id: existDeviceToken._id }, process.env.JWT_SECRET_KEY, { expiresIn: '8d' });
        return res.status(200).json({ success: true, msg: `Device Token Login Successfully .. :) `, data: existDeviceToken })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: `Server Error ` })
    }


});


// login
router.post('/addToken', async (req, res) => {
    try {
        const { deviceToken } = req.body;

        const existDeviceToken = await DeviceToken.findOne({ deviceToken });

        if (!existDeviceToken) {
            return res.status(404).json({ success: false, msg: 'Device Token Not found' });
        }

        const token = jwt.sign({ _id: existDeviceToken._id }, process.env.JWT_SECRET_KEY, { expiresIn: '8d' });
        return res.status(200).json({ success: true, msg: 'Device Token Login Successfully .. :)', data: existDeviceToken, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});



//update 
router.put('/addToken/:deviceTokenId', async (req, res) => {
    try {

        const { deviceTokenId } = req.params;
        const { deviceToken } = req.body;

        const existDeviceToken = await DeviceToken.findByIdAndUpdate( deviceTokenId ,{
            $set : {
                deviceToken :deviceToken
            }
        } , {new : true});

        if (!existDeviceToken) {
            return res.status(404).json({ success: false, msg: 'Device Token Not found' });
        }

        const token = jwt.sign({ _id: existDeviceToken._id }, process.env.JWT_SECRET_KEY, { expiresIn: '8d' });
        return res.status(200).json({ success: true, msg: 'Device Token Update Successfully .. :)', data: existDeviceToken, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});



//delete
router.delete('/addToken/:deviceTokenId', async (req, res) => {
    try {

        const { deviceTokenId } = req.params;

        const existDeviceToken = await DeviceToken.findByIdAndDelete(deviceTokenId );

        if (!existDeviceToken) {
            return res.status(404).json({ success: false, msg: 'Device Token Not found' });
        }

        return res.status(200).json({ success: true, msg: 'Device Token Delete Successfully .. :)', data: existDeviceToken, });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});



//get all
router.get('/addToken/all', async (req, res) => {
    try {

        const existDeviceToken = await DeviceToken.find();

        if (!existDeviceToken) {
            return res.status(404).json({ success: false, msg: 'Device Token Not found' });
        }

        return res.status(200).json({ success: true, msg: 'Device Token Data Successfully .. :)', data: existDeviceToken, });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});



//get by id
router.get('/addToken/:deviceTokenId', async (req, res) => {
    try {

        const { deviceTokenId } = req.params;

        const existDeviceToken = await DeviceToken.findById(deviceTokenId );

        if (!existDeviceToken) {
            return res.status(404).json({ success: false, msg: 'Device Token Not found' });
        }

        return res.status(200).json({ success: true, msg: 'Device Token One Data Successfully .. :)', data: existDeviceToken, });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Server Error' });
    }
});



module.exports = router