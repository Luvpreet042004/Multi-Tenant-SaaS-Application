"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateRequestMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Return 400 Bad Request with error details
                return res.status(400).json({ error: error.errors });
            }
            next(error); // If the error isn't a ZodError, pass it on to the next middleware
        }
    };
};
exports.default = validateRequestMiddleware;
