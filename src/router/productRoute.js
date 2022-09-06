const router = require('express').Router();
const controller = require('../controller/productController');
const {authenticateAccount, checkIfVendor} = require('../middleware/authentication');

router
.get("/", controller.getAllProducts)
.post("/create", authenticateAccount, checkIfVendor, controller.createNewProduct)
.put("/:id", authenticateAccount, controller.updateProduct)
.delete("/:id", authenticateAccount, controller.deleteProduct);

module.exports = router;