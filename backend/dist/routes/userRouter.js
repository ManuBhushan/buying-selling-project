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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const userRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: body.email
            }
        });
        if (user) {
            return res.status(409).send("User already exist");
        }
        const hasdedPassword = yield bcrypt_1.default.hash(body.password, 10);
        const newUser = yield prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: hasdedPassword
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, name: body.name, email: body.email }, config_1.config.JWT_SECRET);
        return res.send(token);
    }
    catch (error) {
        console.log(error);
        return res.status(411).send("Error while creating user");
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                email: body.email
            }
        });
        if (!user) {
            return res.status(409).send("User dont exist");
        }
        // const res= check hashed password and inpt password
        const result = yield bcrypt_1.default.compare(body.password, user.password);
        if (!result) {
            return res.status(409).send("Wrong inputs");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email }, config_1.config.JWT_SECRET);
        return res.send(token);
    }
    catch (error) {
        return res.status(411).send("Error while signing user");
    }
}));
exports.default = userRouter;
