const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js")
const userRouter = express.Router();


const USER_SAFE_DATA = ["firstName","lastName","photoUrl","age","about","skills"];
userRouter.get("/user/requests/received",userAuth,async (req,res)=>{
   try{
    const loggedInUser = req.user;
    // .populate() helps to find name from the ref to user table
    const connectionRequests = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested",
    }).populate("fromUserId",USER_SAFE_DATA);
    res.json({message:"Data fetched successfully",data:connectionRequests});
   }catch(err){
    res.status(400).send("ERROR: "+err.message);
   }

});

userRouter.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id,status:"accepted"},
                {toUserId:loggedInUser._id,status:"accepted"},
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data = connections.map((row)=>{
            if(row.fromUserId._id!=loggedInUser._id){
                return row.fromUserId;
            }
            return row.toUserId;
        });
        res.json({
            message: "Connection fetched successfully",
            data,
        });

    }catch(err){
        res.status(400).send({message : err.message});
    }
});


module.exports = userRouter;