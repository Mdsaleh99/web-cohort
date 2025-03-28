import jwt from "jsonwebtoken";

const isLoggedIn = (req, res, next) => {
  try {
    // 1. extract token from request of the user API call (from cookies)
    const token = req.cookies.jwtToken;

    // 2. check if token exists
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    // 3. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. check if user exists
    if (!decoded) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized access",
      });
    }

    // 5. pass the user data to the next middleware
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export default isLoggedIn;
