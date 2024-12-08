"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware to parse JSON
app.use(express_1.default.json());
// Routes
app.use('/api', index_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
