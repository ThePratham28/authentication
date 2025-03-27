const AuthenticateUser = async (req, res, next) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("User authenticated");
        next();
    } catch (error) {
        res.status(500).json({
            message: "Authentication failed",
            error: error.message,
        });
    }
}

export default AuthenticateUser;