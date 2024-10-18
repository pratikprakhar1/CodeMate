const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js")
const userRouter = express.Router();

userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
   try{
    const loggedInUser = req.user;
    // .populate() helps to find name from the ref to user table
    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
    }).populate("fromUserId",["firstName","lastName","photoUrl","age","about","skills"]);
    res.json({message:"Data fetched successfully",data:connectionRequests});
   }catch(err){
    res.status(400).send("ERROR: "+err.message);
   }

});



module.exports = userRouter;