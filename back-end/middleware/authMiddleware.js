const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')
module.exports = function (req,res,next) {
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token);
    if(!token){
      return res.status(403).json({message: 'forbidden'})
    }
    const decodedData = jwt.verify(token,secretKey)
    req.user = decodedData

    // console.log(req.user);
    next();
  } catch (e){
    console.log(e);
    return res.status(403).json({message: 'forbidden'})
  }
}