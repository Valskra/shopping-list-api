
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    next();
});
try {
    const connectDB = require('./src/config/database');
    connectDB();
} catch (error) {
}

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
try {
    const itemRoutes = require('./src/routes/items');
    app.use('/api/items', itemRoutes);
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

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl,
        method: req.method
    });
});

app.use((err, req, res, next) => {
    console.error('❌ Erreur détectée:', err.message);
    console.error('Stack:', err.stack);

    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
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
    server.close(() => {
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        process.exit(0);
    });
});

module.exports = app;