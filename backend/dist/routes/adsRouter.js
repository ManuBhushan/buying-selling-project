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
const adsRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
adsRouter.use("/", (req, res, next) => {
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
            next();
        }
    }
    catch (e) {
        return res.status(411).send("Wrong user");
    }
});
adsRouter.post("/createAd", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userid = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.id;
        const { price, title, description, category, imageLink, } = req.body;
        const data = Object.assign(Object.assign(Object.assign({ userId: userid, price: price, imageLink: imageLink }, (title && { title: title })), (description && { description: description })), (category && { category: category }));
        const ad = yield prisma.ads.create({ data });
        return res.send(ad);
    }
    catch (error) {
        console.log(error);
        return res.status(411).send("Error while creating ad");
    }
}));
adsRouter.get('/myads', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.id;
        const ads = yield prisma.ads.findMany({
            where: {
                userId: userId
            }
        });
        return res.send(ads);
    }
    catch (e) {
        return res.status(411).send("Error while fetching ads");
    }
}));
exports.default = adsRouter;
