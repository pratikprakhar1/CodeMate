const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const {validateEditProfileData} = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const profileRouter = express.Router();
const validator = require("validator");

//profile api
profileRouter.get('/profile/view',userAuth,async (req,res)=>{
    try{
    const user = req.user;
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
});
//profile edit api
profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{
    try{
        validateEditProfileData(req);
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile added succeessful!!!`,
            data: loggedInUser
    });
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    };
})
//profile password api
profileRouter.patch('/profile/password',userAuth,async (req,res)=>{
    try{
        const passwordData = req.body;
        const oldPassword = passwordData.oldPassword;
        const newPassword = passwordData.newPassword;
        const user = req.user;
        const isPasswordValid = await user.validatePassword(oldPassword);
        if(!isPasswordValid){
            throw new Error('Please enter a valid old password');
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter a strong Password!");
        }
        const passwordHash = await bcrypt.hash(newPassword,10);
        user.password=passwordHash;
        await user.save();
        res.send('Password Updated Successfully!!!!');
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    };
});


module.exports = profileRouter;