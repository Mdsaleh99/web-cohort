import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
