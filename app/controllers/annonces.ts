import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const AnnonceController = {
    /**
     * Creates a new annonce and saves it to the database.
     * @param {Request} req - The request object containing the body of the request.
     * @param {Response} res - The response object to send the response back to the client.
     */
    createAnnonce: async (req: Request, res: Response) => {
        try {
            const { date_debut, date_fin, description, titre, gardeId, isConseil } = req.body;
            const proprietaireId = (req as any).userId;
            if (!date_debut || !date_fin || !description || !titre) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const newAnnonce = await prisma.annonce.create({
                data: {
                    date_debut,
                    date_fin,
                    description,
                    titre,
                    proprietaireId,
                    gardeId: gardeId ? parseInt(gardeId) : null,
                    isConseil: Boolean(isConseil)
                }
            });
            res.status(201).json(newAnnonce);
        } catch (error) {
            console.error("Error creating annonce:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     * Retrieves a specific announce by its ID.
     * @param {Request} req - The request object containing the ID parameter.
     * @param {Response} res - The response object to send the response back to the client.
     */
    getAnnonce: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Annonce ID is required" });
            }
            const annonce = await prisma.annonce.findUnique({
                where: { id: parseInt(id) }
            });
            if (!annonce) {
                return res.status(404).json({ message: "Annonce not found" });
            }
            res.status(200).json(annonce);
        } catch (error) {
            console.error("Error retrieving annonce:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     *  Searches for an announce by date and description.
     * @param {Request} req - The request object containing the body of the request.
     * @param {Response} res - The response object to send the response back to the client.
     */
    searchAnnonce: async (req: Request, res: Response) => {
        try {
            const { date_debut, date_fin, description, titre, isConseil } = req.body;
            const proprietaireId = (req as any).userId;
            if (!date_debut || !date_fin || !description || !titre) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            res.status(201).json(newAnnonce);
        } catch (error) {
            console.error("Error creating annonce:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};

export default AnnonceController;
