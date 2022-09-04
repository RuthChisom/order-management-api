const {Schema, model} = require('mongoose');

const accountSchema = new Schema({
    firstName: {type: String, required:true},
    lastName: {type: String, required:true},
    userName: {type: String, required:true},
    email: {type: String, required:'Email Address is required', unique: true},
    password: {type: String, required:true},
    role: {type: String, enum: ["customer", "vendor", "admin"], required:true}
},
{timestamps:true}
);

const accountModel = model("accounts", accountSchema);

module.exports = accountModel;