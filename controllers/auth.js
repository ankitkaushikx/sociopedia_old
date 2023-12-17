import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

import User from "../models/User.js";
const { jwt } = JWT;
/* --------------------------------------REGISTER USER  */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
    const salt = await bcrypt.genSalt(); ///generate a salt for our password
    const passwordHash = await bcrypt.hash(password, salt); ///generate a salted password
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impression: Math.floor(Math.random() * 1000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
