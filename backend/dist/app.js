"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//For environment variables ask for the .env file
//NOTE: Dont forget to install the dependencies with `npm install`!!!
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Import routes
const user_routes_1 = __importDefault(require("./routes/user-routes"));
const auth_routes_1 = __importDefault(require("./routes/auth-routes"));
const connection_1 = require("./db/connection");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json()); //To parse JSON data 
app.use((0, cors_1.default)()); //To enable CORS
// Connect to the database
(0, connection_1.connectDB)().catch(error => console.error('Database connection failed:', error));
// Routes
app.use("/api/users", user_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
// Initialize the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT || 3000}`);
});
//# sourceMappingURL=app.js.map