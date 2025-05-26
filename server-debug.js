// ÉTAPE 1: Créer un server-debug.js pour identifier le problème
// Fichier: server-debug.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

console.log('✅ Démarrage du serveur de debug...');
console.log('Node version:', process.version);
console.log('Express version:', require('express/package.json').version);

// Middleware de base
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middlewares de base chargés');

// Route de santé simple
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

console.log('✅ Route /health ajoutée');

// TEST 1: Essayer de charger la base de données
console.log('🔍 TEST 1: Chargement de la configuration base de données...');
try {
    const connectDB = require('./src/config/database');
    console.log('✅ Configuration base de données chargée');

    // Appeler connectDB() ici si vous voulez tester la connexion
    // connectDB();
} catch (error) {
    console.error('❌ Erreur configuration base de données:', error.message);
}

// TEST 2: Essayer de charger le modèle
console.log('🔍 TEST 2: Chargement du modèle Item...');
try {
    const Item = require('./src/models/Item');
    console.log('✅ Modèle Item chargé');
} catch (error) {
    console.error('❌ Erreur modèle Item:', error.message);
}

// TEST 3: Essayer de charger le contrôleur
console.log('🔍 TEST 3: Chargement du contrôleur...');
try {
    const itemController = require('./src/controllers/itemController');
    console.log('✅ Contrôleur chargé');
    console.log('Méthodes disponibles:', Object.keys(itemController));
} catch (error) {
    console.error('❌ Erreur contrôleur:', error.message);
}

// TEST 4: Essayer de charger les routes (SANS les utiliser)
console.log('🔍 TEST 4: Chargement des routes...');
try {
    const itemRoutes = require('./src/routes/items');
    console.log('✅ Routes chargées');
} catch (error) {
    console.error('❌ Erreur routes:', error.message);
    console.error('Stack trace:', error.stack);
}

// TEST 5: Créer des routes simples manuellement
console.log('🔍 TEST 5: Création de routes simples...');
try {
    app.get('/api/test', (req, res) => {
        res.json({ message: 'Route de test fonctionnelle' });
    });

    app.get('/api/items', (req, res) => {
        res.json({
            success: true,
            message: 'Route items simple',
            data: []
        });
    });

    console.log('✅ Routes simples créées');
} catch (error) {
    console.error('❌ Erreur création routes simples:', error.message);
}

// Gestion des erreurs globales
app.use((err, req, res, next) => {
    console.error('❌ Erreur globale:', err);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur',
        error: err.message
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('🚀 Serveur de debug démarré sur le port', PORT);
    console.log('🔗 Testez: http://localhost:' + PORT + '/health');
    console.log('🔗 Testez: http://localhost:' + PORT + '/api/test');
}).on('error', (err) => {
    console.error('❌ Erreur de démarrage:', err);
});

module.exports = app;