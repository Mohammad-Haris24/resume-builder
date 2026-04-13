import  jwt  from "jsonwebtoken";
import User from "../models/User.js";
import  bcrypt  from 'bcrypt';
import ResumeModel from "../models/Resume.js";


// controller for user registration
// POST: /api/users/register

const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'})
    return token ;
}



export const registerUser = async (req, res) =>{
    try {
        const {name, email, password} = req.body ;

        // check if required fields are present
        if(!name || !email || !password){
          return  res.status(400).json({message : "Missing Required Fields"})
        }

        // check if user already exists
      const user = await User.findOne({email})

      if(user){
         return  res.status(400).json({message : "User Already Exists"}) 
      }

      // create new user
      const hashedPassword = await bcrypt.hash(password,10);
      const newUser = await User.create({
        name, email, password : hashedPassword
      })

      // return success message
      const token = generateToken(newUser._id);
      newUser.password = undefined;
      return  res.status(201).json({message : "User created Successfully !", token , user : newUser}) 

    } catch (error) {
        return  res.status(400).json({message : error.message}) 
    }
}


// controller for user login
// POST: /api/users/login

export const loginUser = async (req, res) =>{
    try {
        const { email, password} = req.body ;

        // check if user exists
      const user = await User.findOne({email})

      if(!user){
         return  res.status(400).json({message : "Invalid email or Password"}) 
      }

      // check if password is correct
      if(!user.comparePassword(password)){
         return  res.status(400).json({message : "Invalid email or Password"}) 
      }


      // return success message
      const token = generateToken(user._id);
      user.password = undefined;
      return  res.status(201).json({message : "Login Successfull !", token , user }) 

    } catch (error) {
        return  res.status(400).json({message : error.message}) 
    }
}


// controller for getting user by id
// GET: /api/users/data

export const getUserById = async (req, res) =>{
    try {
        
        const userId = req.userId;

        // check if user exists
        const user = await User.findById(userId);

        if(!user){
            return  res.status(404).json({message : "User Not Found"})
        }

        // return user
        user.password = undefined ; 

      return  res.status(201).json({ user }) 

    } catch (error) {
        return  res.status(400).json({message : error.message}) 
    }
}


// controller for getting user resumes
// GET: /api/users/resumes
export const getUserResumes = async (req, res)=>{
     try {
        
    console.log("UserId:", req.userId); // 👈 check this
    const Resumes = await ResumeModel.find({ userId: req.userId });
    return res.status(200).json({ Resumes });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}