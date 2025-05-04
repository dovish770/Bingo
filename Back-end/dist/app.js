"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const Route_1 = __importDefault(require("./Routes/Route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
(0, db_1.default)();
app.use((0, cookie_parser_1.default)());
app.use("/api", Route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
