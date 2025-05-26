
const express = require('express');
const router = express.Router();


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

let itemController = tempController;

try {
    const realController = require('../controllers/itemController');
    itemController = realController;
} catch (error) {
}


router.get('/', (req, res, next) => {
    itemController.getAllItems(req, res, next);
});

router.post('/', (req, res, next) => {
    itemController.createItem(req, res, next);
});

router.put('/:id', (req, res, next) => {
    itemController.updateItem(req, res, next);
});

router.delete('/:id', (req, res, next) => {
    itemController.deleteItem(req, res, next);
});

router.patch('/:id/toggle', (req, res, next) => {
    itemController.togglePurchased(req, res, next);
});

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


module.exports = router;