import winstonLogger from "../logger/winston.logger.js";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    // Zod validation
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message);
      winstonLogger.warn(`Validation failed: ${errors.join(", ")}`);
      return res.status(400).json({ errors });
    }
    req.validatedData = result.data;
    next();
  } catch (error) {
    winstonLogger.error(`Validation error: ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};
