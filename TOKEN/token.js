// const jwt = require('jsonwebtoken');

// const authenticateToken = (req,res,next)=>{
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];
//     console.log(token);
//     if(!token){
//       return res.Status(403).send(err);
//     }
//     jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
//       if(err){
//         res.Status(403).send("verify Error.........")
//       }
//       req.user =user; 
//       next();
//     })
//   }  
//   exports.module = {authenticateToken };