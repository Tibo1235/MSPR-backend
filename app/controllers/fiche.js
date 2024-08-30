"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const FicheController = {
    /**
     * Creates a new fiche and saves it to the database, including handling photo uploads.
     * @param {Request} req - The request object containing the body and files of the request.
     * @param {Response} res - The response object to send the response back to the client.
     */
    createFiche: async (req, res) => {
        try {
            const { especes, contenu } = req.body;
            const photos = req.files;
            const userId = req.userId;
            if (!especes || !contenu || !userId) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            // Create the new fiche entry in the database
            const newFiche = await prisma.fiche.create({
                data: {
                    especes,
                    contenu,
                    proprietaireId: userId, // Store the user's ID as the fiche owner
                },
            });
            // If photos were uploaded, associate them with the newly created fiche
            if (photos && Object.keys(photos).length > 0) {
                // Assuming req.files is an object where each key is a field name containing an array of file objects
                const photoRecords = Object.values(photos).flat().map((photo) => ({
                    url: `/uploads/${photo.filename}`,
                    ficheId: newFiche.id,
                }));
                await prisma.photo.createMany({
                    data: photoRecords,
                });
            }
            res.status(201).json(newFiche);
        }
        catch (error) {
            console.error("Error creating fiche:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     * Retrieves a specific fiche by its ID.
     * @param {Request} req - The request object containing the ID parameter.
     * @param {Response} res - The response object to send the response back to the client.
     */
    getFiche: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Fiche ID is required" });
            }
            const fiche = await prisma.fiche.findUnique({
                where: { id: parseInt(id, 10) },
                include: { photosPlante: true },
            });
            if (!fiche) {
                return res.status(404).json({ message: "Fiche not found" });
            }
            res.status(200).json(fiche);
        }
        catch (error) {
            console.error("Error retrieving fiche:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     * Validates a fiche's data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    validateFiche: async (req, res) => {
        try {
            // Implement validation logic here
            res.status(200).json({ message: "Fiche validation is not yet implemented" });
        }
        catch (error) {
            console.error("Error validating fiche:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     * Searches for fiche by especes.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    searchFiche: async (req, res) => {
        try {
            // Extract 'especes' from query parameters
            const { especes } = req.query;
            if (!especes) {
                return res.status(400).json({ message: "Especes parameter is required" });
            }
            // Construct filters for the search query
            const fiches = await prisma.fiche.findMany({
                where: {
                    especes: {
                        contains: especes,
                        mode: 'insensitive',
                    },
                },
            });
            // Respond with the search results
            res.status(200).json(fiches);
        }
        catch (error) {
            console.error("Error searching fiche:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
    /**
     * Deletes a specific fiche by its ID.
     * @param {Request} req - The request object containing the ID parameter.
     * @param {Response} res - The response object to send the response back to the client.
     */
    deleteFiche: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: "Fiche ID is required" });
            }
            const fiche = await prisma.fiche.delete({
                where: { id: parseInt(id, 10) },
            });
            if (!fiche) {
                return res.status(404).json({ message: "Fiche not found" });
            }
            res.status(200).json({ message: "Fiche deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting fiche:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },
};
exports.default = FicheController;
