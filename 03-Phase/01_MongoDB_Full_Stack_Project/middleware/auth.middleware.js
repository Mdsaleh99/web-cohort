import jwt from "jsonwebtoken"

export const isLoggedIn = async (req, res, next) => {
    try {
        // console.log(req.cookies);
        let token = req.cookies?.token
        // in request object we added cookie property "req.cookies"
        console.log("Token Found: ", token ? "YES" : "NO");
        if (!token) {
            console.log("No token");
            res.status(401).json({
                success: false,
                message: "Authentication failed"
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Data: ", decodedToken);
        req.user = decoded;

        next();
    } catch (error) {
        console.log("Auth middleware failure");
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }

    // next()  // yah ye likhne se response 2 baar jara hai aur error b ara tha because try me se next() karre hai jab try-catch khatam hoga fir se response jaara hai iss next() se next() pass karega agle controller ya middleware ko, yeh issue getMe me ara tha
}