const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log(req.body);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await userModel.findById(decoded.id);
      

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

//otpmiddleware

const localVariables = (req, res, next) =>{
  req.app.locals = {
      OTP : null,
      resetSession : false
  }
  next();
}

module.exports = { protect, localVariables };