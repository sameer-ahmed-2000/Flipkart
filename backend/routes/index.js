const express = require("express");
const userRouter=require("./user");
const productRouter=require("./product");
const router=express.Router();

router.use("/user",userRouter);
router.use("/product",productRouter)
module.exports = router;