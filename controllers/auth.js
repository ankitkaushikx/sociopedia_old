import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
const { sign, verify } = JWT;
import User from "../models/User.js";

const { jwt } = JWT;

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, picturePath, friends, location, occupation } = req.body;
    const saltRounds = 10; // Adjust the number of rounds based on your security requirements
    const passwordHash = await bcrypt.hash(password, saltRounds);
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
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to log in", details: error.message });
  }
};
