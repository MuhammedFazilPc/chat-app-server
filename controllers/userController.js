const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // console.log(req.body)

        // Check if the username already exists
        const userNameCheck = await User.findOne({ name });
        if (userNameCheck) {
            return res.json({ msg: 'Username already exists', status: false });
        }

        // Check if the email already exists
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: 'Email already exists', status: false });
        }

        // Hash the password with bcrypt
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashError) {
            return res.json({ msg: 'Error hashing password', status: false });
        }

        // Create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Remove the password field from the response
        delete user.password;

        return res.json({ status: true, user });
    } catch (ex) {
        next(ex);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email })
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return res.json({ status: true, msg: 'login success', user });
            } else {
                return res.json({ status: false, msg: 'wrong password' });
            }
        } else {
            return res.json({ status: false, msg: "incorrect email" })
        }


    } catch (error) {
        next(error)
    }
}

module.exports.setAvatar = async (req, res, next) => {
    const id = req.params.id;
    const image = req.body.image
    try {
        const user = await User.findByIdAndUpdate(id, {
            isAvatarSet: true,
            avatar: image
        })
        if (user.isAvatarSet) {
            return res.json({ isSet: true, user })
        } else {
            return res.json({ isSet: false, msg: "avatar could not set" })
        }
    } catch (error) {
        next(error)
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "name",
            'email',
            'avatar',
            "_id"
        ])
        return res.json({users})
    } catch (error) {
        next(error)
    }

}