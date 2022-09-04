const router = require('express').Router();
const controller = require('../controller/accountController');
const {authenticateAccount, checkIfAdmin} = require('../middleware/authentication');

router
.get("/accounts", authenticateAccount, checkIfAdmin, controller.getAllAccounts)
.post("/register", controller.registerNewAccount)
.post("/login", controller.loginAccount)
.post("/forgot-password", controller.forgotPassword)
.put("/:id", authenticateAccount, controller.updateAccount)
.delete("/logout", controller.logoutAccount)
.delete("/:id", authenticateAccount, controller.deleteAccount);

module.exports = router;