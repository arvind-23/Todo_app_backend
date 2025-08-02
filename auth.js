const { response } = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "bhjabjkdnsakj";

function auth(req,res,next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token,JWT_SECRET);

    if(decodedData){
        req.userID = decodedData.id;
        next();
    }
    else{
        res.status(403).json({
            message:"Invalid Credentials."
        })
    }
}

module.exports = {
    auth,
    JWT_SECRET
}