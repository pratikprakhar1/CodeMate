const express = require('express');
const {connectDB}=require('./config/database.js')
const User = require('./models/user.js');
const {validateSignUpData} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/auth.js');
const app = express();
app.use(express.json());
app.use(cookieParser());
//signup api
app.post("/signup",async (req,res)=>{
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
app.post("/login", async(req,res)=>{
    try {
        const { emailId,password} = req.body
        const user = await User.userModel.findOne({emailId});
        if(!user){
            throw new Error("Invalid Credential");
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            //create jwt token
            const token = jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn: "1d"});
            res.cookie('token',token);
            res.send("Login successful!!!");
        }else{
            throw new Error("Invalid Credential");
        }
        
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
});
//profile api
app.get('/profile',userAuth,async (req,res)=>{
    try{
    const user = req.user;
    res.send(user);
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
})
//send connection request
app.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    res.send("Connection Request Sent!");
});
connectDB().then(()=>{
    console.log("Databse connection is successful");
    app.listen(3000,()=>{
        console.log("Server is successfully listening on port 3000..");
    })
}).catch((err)=>{
    console.log("Database not connected");
});
