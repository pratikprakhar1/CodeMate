const express = require('express');
const {userAuth} = require('../middlewares/auth.js');
const { __esModule } = require('validator/lib/isAlpha.js');

const requestRouter = express.Router();


//send connection request
requestRouter.post("/sendConnectionRequest",userAuth,async (req,res)=>{
    res.send("Connection Request Sent!");
});


module.exports = requestRouter;