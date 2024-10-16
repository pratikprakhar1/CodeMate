const mongoose = require('mongoose');
const validator = require('validator');
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

const userModel=mongoose.model("User",userSchema);
module.exports = {
    userModel
}