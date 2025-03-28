import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
const isLoggedIn = async(req, res, next) => {
  try {
    // 1. extract token from request of the user API call (from cookies)
    // const token = req.cookies.jwtToken;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    // sbse pehle check kro Access token-> direct login -> naye refresh & acces token generate krdo
    //check access nhi h....refressh check -> naya access or refress dedo
    // dono nhi h_> user se bolo login kre
  
    if(!accessToken){
      if(!refreshToken){
        return res.status(401).json({
          status: false,
          message: "Unauthorized access",
        });
      }
      
      //refresh token hai
      const refreshDecoded= jwt.verify(refreshToken,process.env.REFRESHTOKEN_SECRET)
      console.log(refreshDecoded.id);


      const user =await User.findOne({_id:refreshDecoded.id});
      console.log(user.email);
      
      if(!user){
        return res.status(401).json({
          status: false,
          message: "Unauthorized access",
        });
      }

      
      const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, {
            expiresIn: process.env.ACCESSTOKEN_EXPIRY,
          });
      const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESHTOKEN_SECRET, {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      });

      user.refreshToken=newRefreshToken;
      await user.save();

      const cookieOptions = {
        httpOnly: true,
      };
  
      res.cookie("aceessToken", newAccessToken, cookieOptions);
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      req.user = refreshDecoded;
      next();
    }else{
      const accessDecoded= jwt.verify(accessToken,process.env.ACCESSTOKEN_SECRET)
      
      const user =await User.findOne({_id:accessDecoded.id});
      if(!user){
        return res.status(401).json({
          status: false,
          message: "Unauthorized access",
        });
      }

      
      const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESSTOKEN_SECRET, {
            expiresIn: process.env.ACCESSTOKEN_EXPIRY,
          });
      const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESHTOKEN_SECRET, {
        expiresIn: process.env.REFRESHTOKEN_EXPIRY,
      });

      user.refreshToken=newRefreshToken;
      await user.save();

      const cookieOptions = {
        httpOnly: true,
      };
  
      res.cookie("aceessToken", newAccessToken, cookieOptions);
      res.cookie("refreshToken", newRefreshToken, cookieOptions);
      req.user = accessDecoded;
      next();
    }
    



  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export default isLoggedIn;
