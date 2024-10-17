const validator = require("validator");
const validateSignUpData = (req)=>{
    const {firstName,emailId,password} = req.body;
    if(!firstName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong Password!");
    }
};
const validateEditProfileData = (req)=>{
    const allowedEditFields = [
        "firstName",
        "lastName",
        "emailId",
        "photoUrl",
        "gender",
        "age",
        "about",
        "skills"
    ];
    const data = req.body;
    const isEditAllowed = Object.keys(data).every((k)=> allowedEditFields.includes(k));
    if(!isEditAllowed){
        throw new Error("Invalid Edit request");
    }
    if(data.skills?.length>10){
        throw new Error("Skills can't be more than 10");
    }
    if(data.about?.length>50){
        throw new Error("About can't be more than 50");
    }
}
module.exports = {
    validateSignUpData,
    validateEditProfileData,
}