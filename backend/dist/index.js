"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const cors_1 = __importDefault(require("cors"));
const adsRouter_1 = __importDefault(require("./routes/adsRouter"));
const likeRouter_1 = __importDefault(require("./routes/likeRouter"));
const deleteRouter_1 = __importDefault(require("./routes/deleteRouter"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/user', userRouter_1.default);
app.use('/api/v1/ads', adsRouter_1.default);
app.use("/api/v1/like", likeRouter_1.default);
app.use("/api/v1/unlike", deleteRouter_1.default);
app.listen(port, () => {
    console.log("Server is listening on port: ", port);
});
