const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength:5,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address: "+value);
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        //validate only works walie creating not while updating!!!
        //to run it while updating add option(runValidator) in updatefun
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Please enter a valid user");
            }
        },
    },
    photoUrl:{
        type: String
    },
    about : {
        type: String,
        default: "This is a default value of the user"
    },
    skills: {
        type: [String]
    },
    
},
    {
        timestamps: true,
    }
);
userSchema.methods.getJWT = async function (){
    const user = this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",{
        expiresIn :"7d",
    })
    return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser){
 const user = this;
 const passwordHash = user.password;
 const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);
 return isPasswordValid;
};
const userModel=mongoose.model("User",userSchema);
module.exports = {
    userModel
};