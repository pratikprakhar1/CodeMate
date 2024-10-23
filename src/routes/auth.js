const express = require('express');
const User = require('../models/user.js');
const {validateSignUpData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const upload = require('../config/fileUploadS3.js');

const singleUpLoader = upload.fields([
    { name: 'photoUrl', maxCount: 1 }
]);

const authRouter = express.Router();



//signup api
authRouter.post("/signup", async (req, res) => {
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
            validateSignUpData(req);

            let data = req.body;
            const { password } = data;
            const passwordHash = await bcrypt.hash(password, 10);
            data.password = passwordHash;

            const imageUrl = req.files && req.files['photoUrl']? req.files['photoUrl'][0].location : undefined;
            data.photoUrl = imageUrl;

            const user = new User.userModel(data);
            await user.save();

            res.send("Data inserted successfully!!");
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                data: {},
                err: err.message,
            });
        }
    });
});

//login api
authRouter.post("/login", async(req,res)=>{
    try {
        const { emailId,password} = req.body
        const user = await User.userModel.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credential");
        }
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            //create jwt token
            const token = await user.getJWT();
            res.cookie('token',token);
            res.send("Login successful!!!");
        }else{
            throw new Error("Invalid Credential");
        }
        
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
});

//logout api
authRouter.post("/logout", async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send("User logged out!!");
});

module.exports = authRouter;