const User = require("../models/user.models")
var jwt = require('jsonwebtoken');
require('dotenv').config()

generateToken =(user)=>{
    return jwt.sign({user},process.env.Secret_key)
}

const register = async(req, res) => {
try {
    let user = await User.findOne({email:req.body.email})
    
    if(user){
         return res.status(400).send({message:"User Exists"})
    }
    
     user = await User.create(req.body)
     const token = generateToken(user)
     return res.status(201).send({user,token});
} 
catch(err){
    return res.status(400).send({err:err.message})
}

}

const login = async(req, res) => {
    try {
        const user = await User.findOne({email:req.body.email})
        console.log('user : ', user);

        if(!user){
            return res.status(400).send("Wrong email or password")
        }
        const match = user.checkPassword(req.body.password)
        console.log('match: ', match);
        if(!match){
            return res.status(400).send("Wrong email or password")
        }
    
        const token = generateToken(user);
        return res.status(200).send({user,token})
    } catch (err) {
        return res.status(400).send(err.message)
    }
}

module.exports ={register,login}