const User=require('../models/User')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const jwtSecret = "SECRET";

const signup = async (req, res) => {
    // Implement user signup logic
    const { username, password, email } = req.body;
    try {
      if (username === "" || password === "" || email === "")
        return res.status(400).send({ msg: "All fields are required" });
      const userFromDb=await User.findOne({username})
      if(userFromDb){
        return res.status(400).json({msg: 'user already exists'})
      }
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const user = new User({ username, password: hashedPassword, email });
      await user.save();
      res.status(201).send({msg: "User created successfully"});
    } catch (err) {
      console.log(err);
      res.status(500).send({ msg: "Server error" });
    }
  }
  // ["Autorize"]
const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username: username });
      if (!user) return res.status(400).send({ msg: "User does not exist!" });
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).send({ msg: "Password incorrect!" });
      }
      const token = jwt.sign({ username }, jwtSecret);
      return res.status(200).send({ token, msg: "User signed in!" });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ msg: "Server error!" });
    }
  }
module.exports = { signup, signin };
