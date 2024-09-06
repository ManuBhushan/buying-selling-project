"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const path = __importStar(require("path"));
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
const adsRouter = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
adsRouter.use('/uploads', express_1.default.static(path.join(__dirname, '..', '..', config_1.config.UPLOADS_DIR)));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const destinationPath = path.join(__dirname, '..', '..', config_1.config.UPLOADS_DIR);
        console.log(__dirname);
        console.log(destinationPath);
        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
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
adsRouter.post("/createAd", upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userid = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.id;
        const { price, title, description, category, imageLink, } = req.body;
        const data = Object.assign(Object.assign(Object.assign({ userId: userid, price: price, imageLink: (_b = req.file) === null || _b === void 0 ? void 0 : _b.path }, (title && { title: title })), (description && { description: description })), (category && { category: category }));
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
adsRouter.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // if u want to delete an ad delete it from like also if it is present their 
        const userId = (_a = req.userId) === null || _a === void 0 ? void 0 : _a.id;
        const id = req.params.id;
        const ad = yield prisma.ads.delete({
            where: {
                id: Number(id),
                userId: userId
            },
            include: {
                like: true,
                user: true,
            }
        });
        console.log(ad);
        return res.send("Ad deleted");
    }
    catch (error) {
        console.log(error);
        return res.status(411).send("Error while deleting ad");
    }
}));
exports.default = adsRouter;
