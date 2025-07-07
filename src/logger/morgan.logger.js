import morgan from "morgan";
import winstonLogger from "./winston.logger.js";

// Create a stream for morgan to pipe to winston
const morganStream = {
  write: (message) => winstonLogger.info(message.trim()),
};

// Development format (colored)
const devFormat =
  ":method :url :status :response-time ms - :res[content-length]";

// Production format (more detailed)
const prodFormat =
  "[:date[clf]] :remote-addr :method :url :status :res[content-length] - :response-time ms";

// Create middleware based on environment
const morganMiddleware = morgan(
  process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  { stream: morganStream }
);

export default morganMiddleware;
