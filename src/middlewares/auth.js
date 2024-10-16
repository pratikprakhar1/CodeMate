const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies
        if(!token){
            throw new Error("Invalid Token");
        }
        const decodedData = await jwt.verify(token,"DEV@Tinder$790");
        const {_id} = decodedData;
        const user = await User.userModel.findById(_id);
        if(!user){
            throw new Error("User does not exist");
        }
        req.user=user;
        next();
    }catch(err){
        res.status(400).send("ERROR : "+ err.message);
    }
    

    
};
module.exports={
    userAuth,
};