import { getUser } from "../services/auth.js";

export function checkForAuthentication(req, res, next) {
  let token ;
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if(authHeader && authHeader.startsWith("Bearer")){
    
    token = authHeader.split(" ")[1]
 
    if(!token){
      return res.status(401).json({message: "NO token, authorization denied"})
    }
  }
  else {
    return res.status(401).json({message: 'Invalid token format'})
  }
  
  try {
    const decode = getUser(token);
    if(decode === null){
     
      return res.status(400).json({message: "Invalid token"})      
    }

    req.user=decode;

    // console.log("The decoded user is : " , req.user)
    return next();
  } catch (error) {
    res.status(400).json({message: "Token is not valid"})
  } 
}


// restict to array of roles
export function restrictToOnly(...roles) {
  return function (req, res, next) {
    if (!req.user) {
      return null;
    }
    if (!roles.includes(req.user.role)) return res.status(403).json({message:"Unauthorised"});
    return next();
  };
}
