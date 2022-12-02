const express = require("express");
require("dotenv").config();

const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

app.use(express.json());

const auth = require("./middleware/auth");

const userData = [
    {
        first_name: "John",
        last_name: "Deo",
        email: "johndeo@gmail.com",
        password: "$2a$10$/YSjhY/kytLaX7nWCi9LG.1eXvV9XSug5EftgcVc7yt.6Qnemo49m",
        dob: "05/09/1993",
        occupation:"backend developer",
        company: "galaxy foundation"
    }
]

// Register
app.post("/register", async (req, res) => {

    try {
        // Get user input
        const { first_name, last_name, email, password, phone } = req.body;

        // Validate user input
        if (!email) {
            return res.status(400).send({ code: 400, message: "Email is required", date: new Date() });
        }
        if (!password) {
            return res.status(400).send({ code: 400, message: "Password is required", date: new Date() });
        }
        if (!first_name) {
            return res.status(400).send({ code: 400, message: "First name is required", date: new Date() });
        }
        if (!last_name) {
            return res.status(400).send({ code: 400, message: "Last name is required", date: new Date() });
        }
        if (!phone) {
            return res.status(400).send({ code: 400, message: "Phone is required", date: new Date() });
        }

        // Validate if user exist in our system
        const oldUser = userData.find(usr => usr.email === email);

        if (oldUser) {
            return res.status(409).send({ code: 409, message: "User Already Exist. Please Login", date: new Date() });
        }

        // check phone is already exist in our system
        const oldUserPhone = userData.find(usr => usr.phone === phone);
        if (oldUserPhone) {
            return res.status(409).send({ code: 409, message: "Phone Number Already Exist", date: new Date() });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in system
        const tmpUser = {
            user_id: userData.length + 1,
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
            phone
        }
        userData.push(tmpUser);

        // Create token
        const token = jwt.sign(
            { user_id: userData.length + 1, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // save user token
        tmpUser.token = token;
        
        // return new user
        res.status(201).json(tmpUser);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {

    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!email) {
            return res.status(400).send({ code: 400, message: "Email is required", date: new Date() });
        }
        if (!password) {
            return res.status(400).send({ code: 400, message: "Password is required", date: new Date() });
        }

        // Validate if user exist in our system
        const user = userData.find(usr => usr.email === email);

        if (user && (await bcrypt.compare(password, user.password))) {

            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }

        // redirect with error message
        res.status(400).send("Invalid Credentials");
    } catch (err) {

        // internal server error
        console.log(err);
    }
});

// Get User's
app.get("/user", auth, async (req, res) => {

    // send all user in response if token is valid
    return res.status(200).json({ data: userData });
});

module.exports = app;