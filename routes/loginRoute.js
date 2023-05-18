

require('dotenv').config();
const router = require('express').Router();
const Login = require('../model/loginModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//Login
router.post('/login', async(req,res)=>{

    try{
        const { email, password } = req.body;
        if(!email || !password){
            res.status(401).json({success: false , msg:`Please filled all the required fields` })
        }
        const foundUser = await Login.findOne({email} )

        if(foundUser){
            // const submitPassword = req.body.password;
            const storedPassword = foundUser.password; 

            const passwordMatch = await bcrypt.compare(password, storedPassword)

            if(passwordMatch){
                const email = foundUser.email;

                const isAdmin = foundUser.role === 'admin';
                const token = jwt.sign({id: foundUser._id}, process.env.JWT_SECRET_KEY, { expiresIn: "10d" }); 

                res.status(200).json({success: true, data: foundUser, message: isAdmin ? `Admin Login Successfully` : `User Login SuccessFully :)`,  isAdmin, token,})
            } else{
                res.status(401).json({ success: false, msg: `Invalid Email or password`})
            }

        }  else {
            if(!email || !password){
                res.status(401).json({success: false , msg:`Please filled all the required fields` })
            }
            const hashPassword = await bcrypt.hash(password,10);
            const newUser = new Login({
                email:email,
                password:hashPassword
            });

            const isAdmin = newUser.role === 'admin';
            const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET_KEY,{  expiresIn: "10d" } )

            await newUser.save();
            res.status(200).json({success: true, data: newUser, message: isAdmin ? `Admin Login Successfully` : ` New User Login SuccessFully :)`,  isAdmin, token,})
        }

    } catch(error){
        console.log(error)
        res.status(500).json({ success: false, msg: `Server Error`})
    }
});



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
    
        if (existingUser && existingUser._id.toString() !== userId) {
          return res.status(400).json({ success: false, Msg: 'Please Enter Unique Email-Id' });
        }
    
        const updateUser = await Login.findByIdAndUpdate(userId, updateData, { new: true });
    
        if (!updateUser) {
          return res.status(400).json({ success: false, Msg: 'User Not Found' });
        }
    
        res.status(200).json({ success: true, msg: 'User Update Successfully', data: updateUser });
      
    } catch(error){
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
