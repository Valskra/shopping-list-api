
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

console.log('✅ Démarrage du serveur...');
console.log('Node version:', process.version);

app.use(helmet());
app.use(cors());

console.log('✅ Middlewares de sécurité chargés');

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

console.log('✅ Middlewares de parsing chargés');

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

console.log('✅ Middleware de logging ajouté');

try {
    console.log('🔍 Tentative de connexion à la base de données...');
    const connectDB = require('./src/config/database');
    connectDB();
    console.log('✅ Configuration base de données chargée (connexion désactivée)');
} catch (error) {
    console.log('⚠️  Configuration base de données non disponible:', error.message);
}

app.get('/health', (req, res) => {
    console.log('📊 Health check appelé');
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

console.log('✅ Route /health ajoutée');

console.log('🔍 Chargement des routes API...');
try {
    const itemRoutes = require('./src/routes/items');
    app.use('/api/items', itemRoutes);
    console.log('✅ Routes /api/items ajoutées');
} catch (error) {
    console.error('❌ Erreur lors du chargement des routes:', error.message);
    console.error('Stack:', error.stack);

    app.get('/api/items', (req, res) => {
        res.json({
            success: true,
            message: 'Route de fallback - items',
            data: []
        });
    });

    app.post('/api/items', (req, res) => {
        res.json({
            success: true,
            message: 'Route de fallback - création',
            data: { id: 'fallback-123', name: req.body.name || 'Test' }
        });
    });

    console.log('⚠️  Routes de fallback ajoutées');
}

app.get('/', (req, res) => {
    res.json({
        message: 'API Shopping List',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: '/health',
            items: '/api/items',
            documentation: '/api/items/test'
        }
    });
});

console.log('✅ Route racine ajoutée');

app.use('*', (req, res) => {
    console.log('❌ Route non trouvée:', req.originalUrl);
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl,
        method: req.method
    });
});

console.log('✅ Gestion 404 ajoutée');

app.use((err, req, res, next) => {
    console.error('❌ Erreur détectée:', err.message);
    console.error('Stack:', err.stack);

    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

console.log('✅ Middleware d\'erreur ajouté');

const PORT = process.env.PORT || 3000;

console.log('🚀 Tentative de démarrage du serveur...');

const server = app.listen(PORT, () => {
    console.log('🎉 SERVEUR DÉMARRÉ AVEC SUCCÈS !');
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 URL locale: http://localhost:${PORT}`);
    console.log('');
    console.log('📋 Endpoints disponibles:');
    console.log(`   GET  http://localhost:${PORT}/`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/items`);
    console.log(`   POST http://localhost:${PORT}/api/items`);
    console.log('');
    console.log('✅ Serveur prêt à recevoir des requêtes !');
}).on('error', (err) => {
    console.error('❌ Erreur de démarrage du serveur:', err.message);

    if (err.code === 'EADDRINUSE') {
        console.error(`Le port ${PORT} est déjà utilisé.`);
        console.error('Solutions:');
        console.error('1. Arrêtez le processus qui utilise ce port');
        console.error('2. Changez le port avec: PORT=3001 npm start');
        console.error('3. Trouvez le processus: netstat -ano | findstr :3000');
    }

    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Signal SIGINT reçu (Ctrl+C), arrêt du serveur...');
    server.close(() => {
        console.log('✅ Serveur arrêté proprement');
        process.exit(0);
    });
});

module.exports = app;