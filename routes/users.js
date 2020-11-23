let router = require('../node_modules/express').Router();
const app = require('../app');
const User = require("../models/user_model.js");
const bcrypt = require("../node_modules/bcrypt");
const jwt = require("../node_modules/jsonwebtoken");
const auth = require("../models/auth.js");

/* GET users listening. */ // not working
// router.get('/test', function(req, res) {
//     res.send("respond with a resource");
// });

router.post('/register', async (req, res) => {
    try {
        let { email, password, passwordCheck, displayName, majorType, coursesTaken, bsRequired, semRem } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "not all fields have been filled" });
        }
        if (password.length < 5) {
            return res.status(400).json({ msg: "password must have minimum length of 5" })
        }
        if (password != passwordCheck) {
            return res.status(400).json({ msg: "password must match confirmation" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "account with this email already exists" });
        }
        if (!displayName) displayName = email.substring(0, email.indexOf('@'));

        let salt = await bcrypt.genSalt();
        let pswdHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: pswdHash,
            displayName,
            majorType,
            coursesTaken,
            bsRequired,
            semRem
        });
        console.log(newUser);
        const savedUser = await newUser.save();
        res.json(savedUser);

    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "not all fields have been filled" });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "no user with this email exists" });

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "invalid credentials" });

        const token = jwt.sign({ id: user._id }, "jwt_password_here");
        res.json({
            token,
            user: {
                id: user._id,
                displayName: user.displayName,
                email: user.email,
                coursesTaken: user.coursesTaken,
                bsRequired: user.bsRequired,
                major: user.majorType,
                semRem: user.semRem
            },
        });
    } catch (err) {
        res.status(500).json(err);

    }
});

router.put("/update", async (req, res) => {
    try {
        const user = await User.findById(itemId);
        const item = req.body;
        user.majorType = item.majorType;
        user.coursesTaken = item.coursesTaken;
        user.bsRequired = item.bsRequired;
        user.semRem = item.semRem;
        const savedUser = user.save()
        res.json(saveduser);
    } catch (err) {
        res.status(500).json(err);
    }

});

router.delete("/delete", async (req, res) => {
    console.log(req.body);
    try {
        const deletedUser = await User.findByIdAndDelete(req.body.id);
        res.json(deletedUser);
        //console.log(deletedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/tokenIsValid", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if (!token) return res.json(false);

        const verified = jwt.verify(token, "jwt_password_here");
        if (!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if (!user) return res.json(false);

        return res.json(true);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        coursesTaken: user.coursesTaken,
        bsRequired: user.bsRequired,
        major: user.majorType,
        semRem: user.semRem
    });
});

router.get("/profile", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        coursesTaken: user.coursesTaken,
        bsRequired: user.bsRequired,
        major: user.majorType,
        semRem: user.semRem
    });
});

module.exports = router;