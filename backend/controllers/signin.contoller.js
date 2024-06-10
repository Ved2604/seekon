import { User } from "../models/users.model.js"; 



export async function signupUser(req, res) { 
    
    console.log(req.body)
    const { username, email, password } = req.body;  



    if([username,email,password].some((field)=>field?.trim()==="")){ 

        return res.status(402).json({message:"All fields are required"})
        
    }
  
    try {
      const newUser = new User({ username, email, password }); 
      console.log("New user from MongoDB:",newUser)
      await newUser.save();
  
      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ message: "Username or email already exists" });
      }
      return res.status(500).json({ message: "An error occurred during registration" });
    }
  }
  