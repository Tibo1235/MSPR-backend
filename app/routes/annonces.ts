import express from "express";
//import { AnnonceModel } from "../models/annonce";
import AnnonceController from "../controllers/annonces";

const router = express.Router();

//All the arguments should be passed automatically from the routerObject. Middlewares should be put in between.
router.get("/annonces", AnnonceController.getAnnonce);
router.get('/test/createannonce', AnnonceController.testCreateAnnonce)
router.post("/annonces", AnnonceController.createAnnonce);
router.post("/annonces/:id", AnnonceController.updateAnnonce);
router.delete("/annonces/:id", AnnonceController.deleteAnnonce);

export default router;

