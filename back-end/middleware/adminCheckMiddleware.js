const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')
module.exports = function (req,res,next) {
  if(req.method === "OPTIONS"){
    next()
  }
  try{
    const token = req.headers.authorization.split(' ')[1]

		const path = req.originalUrl.split('/').filter(element => Boolean(element))
		
    if(!token){
      return res.status(401).json({message: 'Unauthorized'})
    }
    const decodedData = jwt.verify(token,secretKey)
    req.user = decodedData

		// console.log(req.user);

		if(path[0] === 'customers' && path[1]){
			if(req.user.role === 'admin'){
				// console.log("hello");
				next()
				return
			}

			console.log(req.user.id , path[1]);

			if(`${req.user.id}` === path[1]){
				next()
				return
			} else {
				return res.status(403).json({message: 'Forbidden'})
			}
		}

		if(req.user.role === 'admin'){
			next();
		} else {
			return res.status(403).json({message: 'Forbidden'})
		}

  } catch (e){
    console.log(e);
    return res.status(401).json({message: 'Unauthorized'})
  }
}