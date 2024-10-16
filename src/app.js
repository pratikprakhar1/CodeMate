const express = require('express');
const {connectDB}=require('./config/database.js')
const app = express();
const User = require('./models/user.js');
const {validateSignUpData} = require("./utils/validation.js");
const bcrypt = require("bcrypt");
app.use(express.json());
//find one user by emailId

app.get("/user",async (req,res)=>{
    const emailId = req.body.emailId;
    try{
        const users = await User.userModel.find({emailId});
        if(!users){
            res.status(404).send('User not found');
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong: "+err.message);
    }
});
//feeds api
app.get("/feed",async (req,res)=>{
    try{
        const users = await User.userModel.find({});
        if(!users){
            res.status(404).send('User not found');
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong: "+err.message);
    }
});
//delete api
app.delete("/user",async (req,res)=>{
    const _id = req.body.id
    try{
        const users = await User.userModel.findByIdAndDelete({_id});
        if(!users){
            res.status(404).send('User not found');
        }else{
            res.send("User deleted");
        }
    }catch(err){
        res.status(400).send("Something went wrong: "+err.message);
    }
});
//update user
app.patch("/user/:userId",async (req,res)=>{
    const _id = req.params?.userId;
    const data = req.body;
    console.log(_id);
    try{
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
            "password"
        ];
        const isUpdateAllowed = Object.keys(data).every((k) => {
            return ALLOWED_UPDATES.includes(k)
        });
        if(!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length>10){
            throw new Error("Skills cannot be more than 10");
        }
        const users = await User.userModel.findByIdAndUpdate({_id},data,{
            runValidators:true,
            returnDoument: "after"
        });
        if(!users){
            res.status(404).send('User not found');
        }else{
            res.send("User updated");
        }
    }catch(err){
        res.status(400).send("Something went wrong: "+err.message);
    }
});
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
            res.send("Login successful!!!");
        }else{
            throw new Error("Invalid Credential");
        }
        
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
});
connectDB().then(()=>{
    console.log("Databse connection is successful");
    app.listen(3000,()=>{
        console.log("Server is successfully listening on port 3000..");
    })
}).catch((err)=>{
    console.log("Database not connected");
});
