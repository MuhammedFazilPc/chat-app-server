const Messages = require("../model/messageModel")

module.exports.send = async (req, res, next) => {
    const { message, users, sender } = req.body
    try {
        await Messages.create({
            message,
            users,
            sender
        })
        return res.json({ msg: "sucess" })
    } catch (error) {
        next(error)
    }
    return res.json({ msg: "failed" })


}

module.exports.getAllMessages = async (req, res, next) => {
    const { receiver, sender } = req.body;
    try {
        const messages = await Messages.find({
            $or: [
                { users: [receiver, sender] },
                { users: [sender, receiver] }
            ]
        });
        // console.log(messages);
        return res.json({ messages, msg: 'success' });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};



