const express = require('express');
const
 {
       sendMessage,
       allMessages
    }= require("../controllers/messageControllers");
const router = express.Router();

//router.route('/').post(protect, sendMessage)//we will check when middleware is available 
router.route('/').post(sendMessage);

//router.route('/:chatId').post(protect, allMessages);

router.route('/:chatId').post(allMessages);

module.exports=router;



// i have to include authmiddle ware here  then after this i will check the api