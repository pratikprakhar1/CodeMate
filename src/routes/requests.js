const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const ConnectionRequest = require("../models/connectionRequest.js")
const User = require("../models/user.js");
const requestRouter = express.Router();


//send connection request
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res)=>{
    try{
        const fromUserId = req.user._id; 
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        //validate
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message:"Invalid status type: "+ status
            });
        }
        //check weather toUserId is valid
        const toUserPresentInDb = await User.userModel.findOne({_id:toUserId});
        if(!toUserPresentInDb){
            return res.status(400).send({message: "User Does Not Exists"});
        };
        //check in db if already present
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId:toUserId, toUserId:fromUserId },
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).send({message: "Connection Request Already Exist"});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message: " Connection Request Sent Successfully",
            data,
        });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }

});


module.exports = requestRouter;