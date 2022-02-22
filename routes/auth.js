const express = require("express");
const router = express.Router();
const User = require("../models/User");
//Used for doing validation of user input
const { body, validationResult } = require("express-validator");
const fetchUser=require('../middleware/fetchUser');
//Using bcryptjs for password hashing
const bcrypt = require("bcryptjs");
//Using JWT for user authentication
const jwt = require("jsonwebtoken");

//Need to put in env file
const JWT_SIGN = "MintDopzTest";

//Endpoints for /api/auth/
//Create a user using: POST "/api/auth/createuser". No Login Required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password Must be 5 character").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //Checking the validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Check wheather email id exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Email is already exist" });
      }
      //Salting and Hashing password
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      //Creating new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePassword,
      });
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);
//Login a user using: POST "/api/auth/login". No Login Required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password should not be blank").exists(),
  ],
  async (req, res) => {
    //Checking the validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    //Check wheather user exist
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please enter the correct creditionals" });
      }

      //Comparing password entered(hash)  and password stored(hash)
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res
          .status(400)
          .json({ error: "Please enter the correct creditionals" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      //Generates the authToken
      const authToken = jwt.sign(data, JWT_SIGN);
      res.send({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

//Get logged in user details using: POST "/api/auth/getuser".Login Required
router.post(
  "/getuser",fetchUser,async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

module.exports = router;
