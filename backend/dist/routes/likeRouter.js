"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const likeRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
likeRouter.use("/", (req, res, next) => {
    try {
        const header = req.header("Authorization") || "";
        const user = jsonwebtoken_1.default.verify(header, config_1.config.JWT_SECRET);
        if (!user) {
            return res.status(409).send("Invalid user");
        }
        else {
            const id = user.id;
            const userId = { id };
            req.userId = userId;
            console.log(id);
            next();
        }
    }
    catch (e) {
        return res.status(411).send("Wrong user");
    }
});
likeRouter.post("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.id;
        const adId = req.params.id;
        console.log(adId);
        const ad = yield prisma.like.create({
            data: {
                userId: userId || 0,
                adId: Number(adId)
            }, include: {
                ad: true
            }
        });
        return res.send(ad);
    }
    catch (error) {
        console.log(error);
        return res.status(411).send("Error while liking ad");
    }
}));
exports.default = likeRouter;
