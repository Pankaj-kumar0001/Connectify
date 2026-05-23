import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";

import Session from "../models/sessionModel.js";


export const registerUser = async (req, res) => {

  try {

    const { name, username, email, password } = req.body;

    // check empty fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // create user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};


export  const loginUser= async(req,res)=>{

try{
  const {email,password} = req.body;

  if(!email ||!password){
    res.status(400).json({
      message:"Both inputs are Mandatory for login"
    })
  }

  const user = await User.findOne({email});

  if(!user){
    res.status(400).json({
      message:"invalid credentionals"
    })
  }

  const isMatch =  user.comparePassword(password);

  if(!isMatch){
    res.status(400).json({
      message:"invalid credentionals"
    })
  }
  const Accesstoken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: false, // true in production (https)
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

 await Session.create({
  userId: user._id,
  refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});

  res.status(200).json({
      message:"User Login successfully",
      Accesstoken,
      user,

    })

}catch (error) {

    res.status(500).json({
      message: error.message,
    });



}
}

export const getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user,
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }

};


export const refreshAccessToken = async (req, res) => {

  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "No refresh token"
    });
  }

  const decoded = jwt.verify(token, config.REFRESH_SECRET);

  const newAccessToken = jwt.sign(
    { id: decoded.id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return res.status(200).json({
    accessToken: newAccessToken
  });

};



export const logout = async (req, res) => {

  try {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        message: "No refresh token found"
      });
    }

    // verify token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    // find session
    const session = await Session.findOne({
      userId: decoded.id,
      refreshToken,
      revoked: false
    });

    if (!session) {
      return res.status(401).json({
        message: "Session not found"
      });
    }

    // revoke session
    session.revoked = true;
    await session.save();

    // clear cookie
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "Logged out successfully"
    });

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};