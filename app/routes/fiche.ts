import express from "express";
//import { AnnonceModel } from "../models/fiche";
import FicheController from "../controllers/fiche";

const router = express.Router();

//All the arguments should be passed automatically from the routerObject. Middlewares should be put in between.
router.get("/fiche", FicheController.getFiche);
router.get('/fiche/validate', FicheController.validateFiche)
router.get('/fiche/research', FicheController.researchFiche);
router.get('/fiche/delete', FicheController.deleteFiche);

export default router;