const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js")
const userRouter = express.Router();
const User = require('../models/user.js');

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

userRouter.get("/feed", userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1; 
        let limit = parseInt(req.query.limit) || 10;
        limit = (limit>50)?50:limit;
        const skip = (page-1)*limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId : loggedInUser._id},
            ],
        }).select("fromUserId  toUserId");
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });
        const users = await User.userModel.find({
        $and: [
            {_id: {$nin : Array.from(hideUsersFromFeed)}},
            {_id: {$ne : loggedInUser._id}},
        ],
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);
        res.send(users);
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports = userRouter;