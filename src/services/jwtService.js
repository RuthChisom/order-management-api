const jwt = require('jsonwebtoken');
require('dotenv').config();
const {SECRET, expiry} = process.env;

// create a token
exports.createToken = (account) => {
    try{
        const payload = { //do not add sensitive info to the payload
            id: account._id,
            userName: account.userName,
            role: account.role,
        };
        let token = jwt.sign(
            payload, 
            SECRET, 
            {expiresIn: expiry}
            );
        return token;
    }catch(err){
        console.error(err);
        return null;
    }
}

// decode a token
exports.decodeToken = (token) => {
    try{
        let decodedToken = jwt.verify(token, SECRET);
        return decodedToken;
    }catch(err){
        console.error(err);
        return null;
    }
}