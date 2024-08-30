"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { AnnonceModel } from "../models/fiche";
const fiche_1 = __importDefault(require("../controllers/fiche"));
const router = express_1.default.Router();
//All the arguments should be passed automatically from the routerObject. Middlewares should be put in between.
router.get("/fiche", fiche_1.default.getFiche);
router.get('/fiche/validate', fiche_1.default.validateFiche);
router.get('/fiche/research', fiche_1.default.researchFiche);
router.get('/fiche/delete', fiche_1.default.deleteFiche);
exports.default = router;
