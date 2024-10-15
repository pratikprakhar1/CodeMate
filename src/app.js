const express = require('express');
const {connectDB}=require('./config/database.js')
const app = express();
const User = require('./models/user.js');
app.post("/signup",async (req,res)=>{
    const user = new User.userModel({
        firstName: "Pratik",
        lastName: "Prakhar",
        emailId: "pratik@.com",
        password: "ayush@123"
    });
 await user.save();
 res.send("Data inserted successfully!!");
});
connectDB().then(()=>{
    console.log("Databse connection is successful");
    app.listen(3000,()=>{
        console.log("Server is successfully listening on port 3000..");
    })
}).catch((err)=>{
    console.log("Database not connected");
});
