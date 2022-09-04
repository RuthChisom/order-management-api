const Account = require("../model/Account");
const bcrypt = require("bcrypt");
const { createToken } = require("../services/jwtService");

// generate password
exports.generatePassword = () => {
    var password = "";
    var alphabets = "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNPQRSTUWXYZ0123456789";
    for(var i=0; i<8; i++){ //password length is 8
        password+=alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    console.log("new password=",password);
    return password;
}

// register a new account
exports.registerNewAccount = (req, res) => {
    // try{
        // get account details from request body and check if a account with this username exists
        Account.findOne({userName: req.body.userName}, (err, existingAccount) => {
            if(err){
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"});
            }
            if(existingAccount){
                return res.status(400).json({message: "An account with this username already exists!!"});
            }
        })
         // create a new account
        let created = Account.create(req.body, (err, newAccount) => {
            if(err){
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"});
            }
            // hash account's password
            bcrypt.genSalt(10, (err, salt) =>{
                if(err){
                    console.error(err);
                    return res.status(500).json({message: "Failed to salt password!"});
                }
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    if(err){
                        console.error({err});
                        return res.status(500).json({message: "Failed to hash password!"});
                    }
                    // save password to db
                    newAccount.password = hashedPassword;
                    newAccount.save((err, savedAccount) => {
                        if(err){
                            console.error({err});
                            return res.status(500).json({message: "Failed to save account password!"});
                        }
                    })
                    // create jwt token for account
                    let token = createToken(newAccount);
                    if(!token){
                        return res.status(500).json({message: "Failed to sign token!"});
                    }
                    // send token to account
                    console.log(token)
                    return res.status(200).json({
                        message: "Account Registration Successful",
                    })
                })
            })
        });
}

// get all accounts
exports.getAllAccounts = async(req, res) => {
    try{
        let listed = await Account.find();
        if(listed.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Account was found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Accounts Found!",
            accounts: listed
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

exports.loginAccount = (req, res) =>{
    // check if account exists
    Account.findOne({userName: req.body.userName}, (err, foundAccount) => {
        if(err){
            console.error({err});
            return res.status(500).json({message: "Unable to login! Please try again later"});
        }
        if(!foundAccount){
            return res.status(401).json({message: "Username Not Found!!"})
        }
        // check if password is correct - we cannot compare the password with equals because it is hashed
        let match = bcrypt.compareSync(req.body.password, foundAccount.password);
        if(!match){
            return res.status(401).json({message: "Incorrect Password"})
        }
        // create jwt token for account
        let token = createToken(foundAccount);
        if(!token){
            console.error({err});
            return res.status(500).json({message: "Failed to sign token!"});
        }
        //set cookie
        res.cookie('nToken',token, {maxAge: 900000, httpOnly: true});
        console.log(token);
        return res.status(200).json({
            message: "Logged In Successfully",
        })
    })
    
}

exports.forgotPassword = (req, res) =>{
    // check if account exists
    Account.findOne({userName: req.body.userName}, (err, foundAccount) => {
        if(err){
            console.error({err});
            return res.status(500).json({message: "Unable to login! Please try again later"});
        }
        if(!foundAccount){
            return res.status(401).json({message: "Username Not Found!!"})
        }
        console.log("account found:",foundAccount);
        // generate new password
        this.generatePassword((err,password)=>{
            console.log("GOT HERE");
            if(err){
                console.log("GOT HERE2");
                console.error(err);
                return res.status(500).json({message: "Failed to generate new password!"});
            }
            console.log("GOT HERE3");
            // hash account's password
            bcrypt.genSalt(10, (err, salt) =>{
                if(err){
                    console.error(err);
                    return res.status(500).json({message: "Failed to salt password!"});
                }
                console.log("password successfully salted ");
                bcrypt.hash(password, salt, (err, hashedPassword) => {
                    if(err){
                        console.error({err});
                        return res.status(500).json({message: "Failed to hash password!"});
                    }
                    console.log("password successfully hashed ");
                    // save password to db
                    foundAccount.password = hashedPassword;
                    foundAccount.save((err, savedAccount) => {
                        if(err){
                            console.error({err});
                            return res.status(500).json({message: "Failed to save account password!"});
                        }
                console.log("password successfully updated in db ");

                    })
                    // send password to user email
                    

                    return res.status(200).json({
                        message: "Password recovered and sent to your email",
                    })
                })
            })
        });

    })
    
}

// update an account
exports.updateAccount = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let updated = await Account.findOneAndUpdate(id, req.body ,{new: true});
        if(!updated){
            return res.status(404).json({
                success: false,
                message: "Account not Updated"
            });
        }
        res.status(200).json({
            success: true,
            message: "Account Updated!",
            account: updated
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

// delete account
exports.deleteAccount = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let deleted = await Account.findOneAndRemove(id);
        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Account not Deleted"
            });
        }
        res.status(200).json({
            success: true,
            message: "Account Successfully Deleted!",
            account: deleted
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

// logout of an account
exports.logoutAccount = (req, res) =>{
    if(!req.headers.authorization){
        return res.status(401).json({message: "Authorization Header required"});
    }
    let splittedHeader = req.headers.authorization.split(' ');
    if(splittedHeader[0] !== 'Bearer'){
        return res.status(401).json({message: "Ensure that the Authorization Format is Bearer <token>"});
    }
    res.clearCookie('nToken');
    return res.status(200).json({
        message: "Logged Out Successfully",
    })
}