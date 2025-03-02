const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
require("dotenv").config();



const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Map, of: Number, default: {} },
  role: { type: String, enum: ['user', 'admin']}
});




userSchema.methods.generateJsonWebToken=function(){
  return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRES,
  })
}

const Users = mongoose.model('User', userSchema);
module.exports = Users;

