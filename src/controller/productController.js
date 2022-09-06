const Product = require("../model/Product");

// create a new product
exports.createNewProduct = (req, res) => {
        req.body.vendor = req.account.id; //set product owner as logged in vendor
         // get product details from request body and check if a product with this title exists for same vendor
        Product.findOne({title: req.body.title, vendor: req.body.vendor}, (err, existingProduct) => {
            if(err){
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"});
            }
            if(existingProduct){
                return res.status(400).json({message: "A product with this title already exists for the same vendor!!"});
            }
        })
         // create a new product
        let created = Product.create(req.body, (err, newProduct) => {
            if(err){
                console.error(err);
                return res.status(500).json({message: "An error occured! Please try again later!"});
            }
                    return res.status(200).json({
                        message: "Product Added Successful",
                    })
        });
}

// get all products
exports.getAllProducts = async(req, res) => {
    try{
        //get query param if available
        let searchQuery = req.query;
        let listed = await Product.find(searchQuery);
        if(listed.length === 0){
            return res.status(404).json({
                success: false,
                message: "No Product was found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Products Found!",
            products: listed
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

// update a product
exports.updateProduct = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let updated = await Product.findOneAndUpdate(id, req.body ,{new: true});
        if(!updated){
            return res.status(404).json({
                success: false,
                message: "Product not Updated"
            });
        }
        res.status(200).json({
            success: true,
            message: "Product Updated!",
            product: updated
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

// delete product
exports.deleteProduct = async(req, res) => {
    try{
        let id = {_id: req.params.id};
        let deleted = await Product.findOneAndRemove(id);
        if(!deleted){
            return res.status(404).json({
                success: false,
                message: "Product not Deleted"
            });
        }
        res.status(200).json({
            success: true,
            message: "Product Successfully Deleted!",
            product: deleted
        })
    }catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}
