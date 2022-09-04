const { decodeToken } = require("../services/jwtService");

exports.authenticateAccount = (req, res, next) => { //next calls the next function after this function has executed
    // check if there is an authorization token
    if(!req.headers.authorization){
        return res.status(401).json({message: "Authorization Header required"});
    }
    let splittedHeader = req.headers.authorization.split(' ');
    if(splittedHeader[0] !== 'Bearer'){
        return res.status(401).json({message: "Ensure that the Authorization Format is Bearer <token>"});
    }
    //ensure that cookie is set, to verify that user is still logged in
    if(!req.headers.cookie){
        return res.status(401).json({message: "You have been logged out, please login"});
    }
    let token = splittedHeader[1];
    // decode the token
    let decodedToken = decodeToken(token); 
    if(!decodedToken){
        return res.status(500).json({message: 'Not Authorized'});
    }
    req.account = decodedToken; //to make account details available throughout the request lifecycle
    //if token is valid, allow the account to continue with request
    next();
}

exports.checkIfAdmin = (req, res, next) => {
    if(req.account.role!='admin'){
        return res.status(401).json({message: "This route is restricted to admins"});
    }
    next();
}