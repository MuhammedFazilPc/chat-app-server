const {send, getAllMessages}= require("../controllers/messageController")
const router= require("express").Router()

router.post('/sendMessage',send)
router.post('/getAllMessages',getAllMessages)

module.exports=router