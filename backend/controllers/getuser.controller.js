import { User } from "../models/users.model.js";

export async function getUserByUsername(req, res) {
    const { username } = req.params;
  
    try {
      const user = await User.findOne({ username }).select("-password -refreshToken");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: "An error occurred while fetching the user" });
    }
  }