const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    title: {type: String, required:true},
    description: {type: String, required:true},
    vendor: {type: String}, //the id of the vendor
    price: {type: Number, required:true}
},
{timestamps:true}
);

const productModel = model("products", productSchema); //products defines the name of the collection

module.exports = productModel;