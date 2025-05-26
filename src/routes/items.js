// Version corrigée du fichier src/routes/items.js
// SANS regex complexe qui cause l'erreur

const express = require('express');
const router = express.Router();

console.log('📍 Chargement du fichier routes/items.js...');

// Contrôleurs temporaires pour éviter les erreurs
const tempController = {
    getAllItems: async (req, res) => {
        try {
            res.json({
                success: true,
                message: 'Endpoint getAllItems fonctionnel',
                count: 0,
                data: []
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur getAllItems',
                error: error.message
            });
        }
    },

    createItem: async (req, res) => {
        try {
            const { name, quantity, category } = req.body;

            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Le nom est obligatoire'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Article créé (mode test)',
                data: {
                    id: 'test-id-123',
                    name,
                    quantity: quantity || 1,
                    category: category || 'autre',
                    purchased: false,
                    createdAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur createItem',
                error: error.message
            });
        }
    },

    updateItem: async (req, res) => {
        try {
            const { id } = req.params;
            const updates = req.body;

            res.json({
                success: true,
                message: 'Article mis à jour (mode test)',
                data: {
                    id,
                    ...updates,
                    updatedAt: new Date().toISOString()
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur updateItem',
                error: error.message
            });
        }
    },

    deleteItem: async (req, res) => {
        try {
            const { id } = req.params;

            res.json({
                success: true,
                message: `Article ${id} supprimé (mode test)`
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Erreur deleteItem',
                error: error.message
            });
        }
    },

    togglePurchased: async (req, res) => {
        try {
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
            res.status(500).json({
                success: false,
                message: 'Erreur togglePurchased',
                error: error.message
            });
        }
    }
};

// Essayer de charger le vrai contrôleur, sinon utiliser le temporaire
let itemController = tempController;

try {
    console.log('🔍 Tentative de chargement du contrôleur réel...');
    const realController = require('../controllers/itemController');
    itemController = realController;
    console.log('✅ Contrôleur réel chargé avec succès');
} catch (error) {
    console.log('⚠️  Contrôleur réel non disponible, utilisation du contrôleur temporaire');
    console.log('Erreur:', error.message);
}

// Définition des routes SIMPLES (sans regex complexe)
console.log('📍 Définition des routes...');

// Route GET /api/items
router.get('/', (req, res, next) => {
    console.log('📥 GET /api/items appelé');
    itemController.getAllItems(req, res, next);
});

// Route POST /api/items
router.post('/', (req, res, next) => {
    console.log('📥 POST /api/items appelé');
    itemController.createItem(req, res, next);
});

// Route PUT /api/items/:id (SIMPLE, sans regex)
router.put('/:id', (req, res, next) => {
    console.log('📥 PUT /api/items/:id appelé avec ID:', req.params.id);
    itemController.updateItem(req, res, next);
});

// Route DELETE /api/items/:id (SIMPLE, sans regex)
router.delete('/:id', (req, res, next) => {
    console.log('📥 DELETE /api/items/:id appelé avec ID:', req.params.id);
    itemController.deleteItem(req, res, next);
});

// Route PATCH /api/items/:id/toggle (SIMPLE, sans regex)
router.patch('/:id/toggle', (req, res, next) => {
    console.log('📥 PATCH /api/items/:id/toggle appelé avec ID:', req.params.id);
    itemController.togglePurchased(req, res, next);
});

// Route de test pour vérifier que le routeur fonctionne
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Routeur items fonctionnel',
        timestamp: new Date().toISOString(),
        availableRoutes: [
            'GET /api/items',
            'POST /api/items',
            'PUT /api/items/:id',
            'DELETE /api/items/:id',
            'PATCH /api/items/:id/toggle',
            'GET /api/items/test'
        ]
    });
});

console.log('✅ Routes définies avec succès');

module.exports = router;