import winstonLogger from "../logger/winston.logger.js";

export async function roleAuthenticate(req, res, next) {
    try {
        if (req.user.role !== "admin"){
            winstonLogger.warn(`Unauthorized access attempt by user ${req.user._id}`)
            return res.status(403).json({message: "Admin access required"})
        }
        next();
    } catch (error) {
        winstonLogger.error(`Role authentication error: ${error.message}`);
        res.status(500).json({ message: "Internal server error 2" });
    }
}