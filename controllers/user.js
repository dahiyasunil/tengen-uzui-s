const User = require("../models/user.model")

const handleGetUser= async (req,res)=>{
    try{
        const mobileNumber = Number(req.params.mobileNumber);        
        let user = await User.findOne({mobileNumber});
        if(!user){
            user = new User({mobileNumber})
            await user.save();
        }
        return res.status(200).json(user);
    }catch(err){
        console.error(
            `An error occured while trying get user.\nError:\n${err}`
          );
          return res.status(500).json({error:`An error occured while trying get user.\nError:\n${err}`})
    }
}

module.exports = { handleGetUser };