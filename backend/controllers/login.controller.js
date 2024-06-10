import { User } from "../models/users.model.js"; 

  



export async function loginUser(req,res){  
    const {email, password, username} =req.body  

    if(!username && ! email ){
        return res.status(400).json({ message: "Username or Email is required" });
    }  

    const user=await User.findOne({
        $or:[{username},{email}]
    })

   if(!user){
    return res.status(404).json({ message: "User doesn't exist" });
   }
   let isPasswordCorrect=user.isPasswordCorrect(password)  

   if(!isPasswordCorrect){
    return res.status(401).json({ message: "Incorrect password" });
   } 

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)   

   const loggedInUser = await User.findById(user._id).select("-password -refreshToken")   

   const options = {
    httpOnly: true,
    secure: true,

   }



   return res
    .status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json({user:loggedInUser})

} 



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}