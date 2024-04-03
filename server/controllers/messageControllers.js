const asyncHandler = require("express-async-handler");
const Message = require("../models/MessageModel");
const userModel = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage=asyncHandler(async (req, res)=>{
    const { content, chatId} = req.body;

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage); 
   
        message = await message.populate("sender", "username profile");
        message = await message.populate("chat");
        message = await userModel.populate(message, {
            path:'chat.users',
            select: "username profile email",

        });
        await Chat.findByIdAndUpdate(req.body.chatId,{ 
            latestMessage: message,
        })

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessages=asyncHandler(async(req, res)=>{
    try {
        const messages = await Message.find({chat:req.params.chatId})
            .populate("sender", "username profile email")
            .populate("chat");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});



module.exports={sendMessage, allMessages};