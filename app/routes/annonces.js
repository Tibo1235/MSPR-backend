"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { AnnonceModel } from "../models/annonce";
const annonces_1 = __importDefault(require("../controllers/annonces"));
const router = express_1.default.Router();
//All the arguments should be passed automatically from the routerObject. Middlewares should be put in between.
router.get("/annonces", annonces_1.default.getAnnonce);
router.get('/test/createannonce', annonces_1.default.testCreateAnnonce);
router.post("/annonces", annonces_1.default.createAnnonce);
router.post("/annonces/:id", annonces_1.default.updateAnnonce);
router.delete("/annonces/:id", annonces_1.default.deleteAnnonce);
exports.default = router;
