const Item = require('../models/Item');

// Récupérer tous les articles
exports.getAllItems = async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des articles',
            error: error.message
        });
    }
};

// Ajouter un nouvel article
exports.createItem = async (req, res) => {
    try {
        const { name, quantity, category } = req.body;

        // Vérification des données
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de l\'article est obligatoire'
            });
        }

        const item = await Item.create({
            name,
            quantity: quantity || 1,
            category: category || 'autre'
        });

        res.status(201).json({
            success: true,
            message: 'Article ajouté avec succès',
            data: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'ajout de l\'article',
            error: error.message
        });
    }
};

// Mettre à jour un article
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const item = await Item.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour',
            error: error.message
        });
    }
};

// Supprimer un article
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Article supprimé avec succès'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la suppression',
            error: error.message
        });
    }
};

// Marquer comme acheté/non acheté
exports.togglePurchased = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        item.purchased = !item.purchased;
        await item.save();

        res.json({
            success: true,
            message: `Article marqué comme ${item.purchased ? 'acheté' : 'non acheté'}`,
            data: item
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};