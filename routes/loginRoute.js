

require('dotenv').config();
const router = require('express').Router();
const Login = require('../model/loginModel');
const bcrypt = require('bcrypt');

//new User
router.post('/newUser', async(req,res)=>{

    try{

        const {email, password } = req.body;
        const foundUser = await Login.findOne({email});

        if(!foundUser){
            const hashPassword = await bcrypt.hash(password,10 );

            const newUser = new Login( {
                email : email,
                password : hashPassword
            });
            // Login.push(newUser);
            await newUser.save();
            console.log(`User List: `, newUser);
            res.status(200).json({ success: true, msg: 'User created successfully', newUser });
        } else{
            res.status(400).json({ success: false, msg: `Email alredy Login or Existing User `})
        }


    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, msg: ' Server error' });
    }

});



//Login
router.post('/login', async(req,res)=>{

    try{
        const { email, password } = req.body;
        const foundUser = await Login.findOne({email} )

        if(foundUser){
            // const submitPassword = req.body.password;
            const storedPassword = foundUser.password; 

            const passwordMatch = await bcrypt.compare(password, storedPassword)

            if(passwordMatch){
                const email = foundUser.email;
                res.status(200).json({success: true, data: foundUser,  msg: `Login SuccessFully  :)`})
            } else{
                res.status(401).json({ success: false, msg: `Invalid Email or password`})
            }

        }  else {
            res.status(401).json({ success: false, msg: `Invalid  or Wrong Email or password` });
        }

    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, msg: `Server Error`})
    }
});





module.exports = router ;
