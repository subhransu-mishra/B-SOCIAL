import asyncHandler from "../middlewares/asyncHandler.js";
import { User } from "../models/user.model.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
});
