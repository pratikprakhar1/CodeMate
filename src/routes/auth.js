const express = require('express');
const User = require('../models/user.js');
const {validateSignUpData} = require("../utils/validation.js");
const bcrypt = require("bcrypt");

const authRouter = express.Router();



//signup api
authRouter.post("/signup",async (req,res)=>{
    const user = new User.userModel(req.body);
    const {password}=req.body;
 try{
    validateSignUpData(req);
    const passwordHash = await bcrypt.hash(password,10);
    user.password=passwordHash;
    await user.save();
    res.send("Data inserted successfully!!");
 }catch(err){
    res.status(400).send("ERROR:" + err.message);
 }
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

module.exports = authRouter;