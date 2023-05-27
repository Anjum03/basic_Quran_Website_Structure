

require('dotenv').config();
const router = require('express').Router();
const Login = require('../model/loginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


//Login
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(401).json({ success: false, msg: `Please fill in all the required fields` });
      }
      
      const foundUser = await Login.findOne({ email });

      if(!foundUser){
        return res.status(404).json({ success: false, message: 'Admin Not Found'

      });
    }

    const passwordMatch = await bcrypt.compare(password , foundUser.password);
    if(!passwordMatch){
        return res.status(400).json({ success: false, message: 'Invalid Password' });
    }  const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET_KEY,{ expiresIn: "8d" });
    res.status(200).json({ success: true, data: foundUser,message: 'Login Successfully', token, });
  
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, msg: 'Server Error' });
    }
  });
  
  


//forgot Password
// Send password reset email
function sendResetPasswordEmail (email,token ){
    try {

        const transporter = nodemailer.createTransport({
            //configure
            service: 'Gmail',
            auth:{
                user: process.env.USEREMAIL,
                pass: process.env.PASSWORD,
            },
    
        })
        
        const mailOptions = {
            from: process.env.USEREMAIL,
            to : email, 
            subject: "Reset Passowrd",
            text: " reset Password Link ",
            html: '<p> Hi '+email+' , PLease Copy the link and <a href =" http://localhost:3000/resetPassword?token='+token+'" > reset the password </a>'
        };

        transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log(error);
            } else{
                console.log('Email, sent : ' + info.response)
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, msg: `Server Error`})
    }

}

router.post('/forgotPassword', async(req,res)=>{
      // step: 1. check exist email 
//         //2.
//         //3. send link on email for reset password  (like : localhost :3000/resetPasssword/userId/token)
//         //4. now get Request localhost link with userID and token (like : localhost:3000/resetPassord/:id/:token) id = userid and token = jwt token 
//         //

try{
        const email  = req.body.email; 

        const user = await Login.findOne({ email: email }) ;

        if(user){ //user Exist

            const randomString = randomstring.generate(7) // --> 7 means only seven alpha pbet is present

            const updateTokeninDB = await Login.updateOne({email:email}, {$set: {token: randomString}}, {new: true});
            //send email part
            sendResetPasswordEmail(user.email,randomString); 

            return res.status(200).json({ success: true, msg:`Please check your Email and Reset Password`})
            
            // res.status(400).json({ success: false, msg:`User Not Found`});
        } else{ //user not exist
            res.status(400).json({ success: false, msg: `This Email Doesn't Exist . Please Login Again`})
        }

// return res.status(200).json({ success: true, msg:`Reset Password email Sent`})
// inside email one link to add new password 

    } catch(error){
        console.log(error)
        res.status(500).json({ success: false , msg : `Server Error `})
    }

});


//reset Password
router.get('/resetPassword', async(req,res)=>{
    
    try {
        const token = req.query.token ;
        const tokenData = await Login.findOne({token:token});
        if(tokenData){
            const password = req.body.password

            const newPassword = await bcrypt.hash(password,10);

           const userNewPassword =  await Login.findByIdAndUpdate({ _id:tokenData._id }, { $set: {password: newPassword, token: ' '}} ,{new:true})
           
           res.status(200).json({ success: true, msg: `User Password has been reset `, data: userNewPassword})
        } else{
            res.status(400).json({ success: false, msg: `This link has expired`})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false , msg : `Server Error `})
        
    }

});



//change password
// router.post('/changePassword', async(req,res)=>{

//     const {email, newPassword, oldPassword} = req.body ;

//     try{

//         const user = await Login.findOne({email});

//         if(!user){
//             return res.status(400).json({ success: false, msg: `User Not Found`});
//         }

//         const isMatch = await bcrypt.compare (oldPassword, user.password)
//         if(!isMatch){
//             return res.status(401).json({ success: false , msg: `Your Old Password is Wrong !!!`})
//         } else{

//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(newPassword, salt);
//             user.password = hashedPassword ;
//             await user.save();
//             return res.status(200).json({ success: true, message: 'Password changed successfully!' });
//         }

//         // const code = crypto.randomBytes(20).toString('hex');

//         //update the user's [Password and clear the forgotPasswordCode in DB]

//     } catch (error){
//         console.log(error);
//         return res.status(500).json({ success: false, msg:`Server Error`})
//     }

// });


// logout
router.post('/logout', async(req,res)=>{

    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logout' });


});


//Update User
router.put('/update/:id', async(req,res)=>{

    const userId = req.params.id ;

    const updateData = req.body ;

    try {
        const existingUser = await Login.findOne({ email: updateData.email });
    
        if (!existingUser) {
          return res.status(400).json({ success: false, Msg: 'User Not Found' });
        } else{

            if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).json({ success: false, Msg: 'Please Enter Unique Email-Id' });
            }
            
            if( updateData.password ){
                const salt = 10 
                const newHashedPassword = await bcrypt.hash( updateData.password, salt);
                updateData.password = newHashedPassword ;
            }
       

            const updateUser = await Login.findByIdAndUpdate(userId, updateData, { new: true });
        
            res.status(200).json({ success: true, msg: 'User Update Successfully', data: updateUser });
          
        }

    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, msg: `Server Error`})
    }

})



//delete User
router.delete('/delete/:id', async(req,res)=>{

    try{

        const deleteUser = await Login.findByIdAndDelete({_id: req.params.id});

        if(!deleteUser){
            res.status(400).json({ success: false, msg:` User Not Found`})
        }

        res.status(200).json({ success: true, msg:`User Deleted Successfully `  ,data: deleteUser})

    } catch(error){
        res.status(500).json({  success: false, msg: `Server Error :( )` })
    }

});


//get all User
router.get('/allUser', async(req,res)=>{
    try{

        const allUser = await Login.find();
    
        if(!allUser){
            res.status(400).json({ success: false, msg: `User Not Found`});
        }
    
        res.status(200).json({ success: true, msg: `All User`, data: allUser});

    } catch(error){
        res.status(500).json({success:false, msg:`Server Error`})
    }

});


//getById User
router.get('/:id', async(req,res)=>{

    try{

        const oneUser = await Login.findById({_id:req.params.id});
    
        if(!oneUser){
            res.status(400).json({success: false, msg:`User Not Found`});
        }
    
        res.status(200).json({success: true, msg: `GetByID User Here`, data: oneUser});

    } catch(error){
        res.status(500).json({success:false, msg:`Server Error`});
    }

});

module.exports = router ;
