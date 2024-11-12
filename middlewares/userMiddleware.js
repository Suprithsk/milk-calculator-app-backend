const User=require('../models/User');
const jwt=require('jsonwebtoken');
const jwtSecret = "SECRET";

exports.userMiddleware=async (req,res,next)=>{
    let token=req.header('Authorization');
    if(!token){
        return res.status(401).send({msg:"Token not found"})
    }
    if(token.startsWith('Bearer ')){
        token=token.slice(7,token.length).trimLeft();
    }
    try{
        const {username}=jwt.verify(token,jwtSecret)
        const user=await User.findOne({username})
        if(!user){
            return res.status(400).send({msg:"User not found"})
        }
        req.user=user;
        next();
    }catch(err){
        console.log(err);
        res.status(500).send({msg:"Server error"})
    }
}