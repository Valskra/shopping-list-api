// Version ultra-simple du contrôleur pour tester
// Fichier: src/controllers/itemController.js

console.log('📍 Chargement du contrôleur itemController...');

// Récupérer tous les articles
exports.getAllItems = async (req, res) => {
    try {
        console.log('📥 getAllItems appelé');
        res.json({
            success: true,
            count: 0,
            data: [],
            message: 'Contrôleur simple fonctionnel'
        });
    } catch (error) {
        console.error('Erreur getAllItems:', error);
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
        console.log('📥 createItem appelé avec:', req.body);
        const { name, quantity, category } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Le nom de l\'article est obligatoire'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Article ajouté avec succès (mode test)',
            data: {
                id: 'test-' + Date.now(),
                name,
                quantity: quantity || 1,
                category: category || 'autre',
                purchased: false,
                createdAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erreur createItem:', error);
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
        console.log('📥 updateItem appelé pour ID:', req.params.id);
        const { id } = req.params;
        const updates = req.body;

        res.json({
            success: true,
            message: 'Article mis à jour avec succès (mode test)',
            data: {
                id,
                ...updates,
                updatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erreur updateItem:', error);
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
        console.log('📥 deleteItem appelé pour ID:', req.params.id);
        const { id } = req.params;

        res.json({
            success: true,
            message: `Article ${id} supprimé avec succès (mode test)`
        });
    } catch (error) {
        console.error('Erreur deleteItem:', error);
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
        console.log('📥 togglePurchased appelé pour ID:', req.params.id);
        const { id } = req.params;

        res.json({
            success: true,
            message: `Statut de l'article ${id} basculé (mode test)`,
            data: {
                id,
                purchased: true,
                updatedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Erreur togglePurchased:', error);
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut',
            error: error.message
        });
    }
};

console.log('✅ Contrôleur itemController chargé avec succès');