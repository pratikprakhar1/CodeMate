const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const {validateEditProfileData} = require('../utils/validation.js');
const bcrypt = require('bcrypt');
const upload = require('../config/fileUploadS3.js');
const deleteFileFromS3 = require('../config/fileDeleteS3.js');

const singleUpLoader = upload.fields([
    { name: 'photoUrl', maxCount: 1 }
]);

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
            message: `${loggedInUser.firstName}, your profile edit succeessful!!!`,
            data: loggedInUser
    });
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    };
})
//edit profile photo
profileRouter.patch('/profile/photo',userAuth,async (req,res)=>{
    singleUpLoader(req, res, async function (err) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Image upload failed',
                data: {},
                err: err.message,
            });
        }
        try {
            const loggedInUser = req.user;
            const oldPhotoUrl = loggedInUser.photoUrl;
            const imageUrl = req.files && req.files['photoUrl'] ? req.files['photoUrl'][0].location : undefined;
      
            if (imageUrl) {
              if (oldPhotoUrl) {
                const oldFileKey = oldPhotoUrl.split('/').pop();
                await deleteFileFromS3(oldFileKey);
              }
              loggedInUser.photoUrl = imageUrl;
            } else {
              throw new Error("Please insert a profile photo to be updated");
            }
      
            await loggedInUser.save();
            res.json({
              message: `${loggedInUser.firstName}, your profile edit was successful!!!`,
              data: loggedInUser,
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                data: {},
                err: err.message,
            });
        }
    });
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