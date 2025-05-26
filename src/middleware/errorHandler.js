const errorHandler = (err, req, res, next) => {
    console.error('Erreur détectée:', err.message);

    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            error: message
        });
    }

    // Erreur MongoDB duplicate key
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Données dupliquées détectées'
        });
    }

    // Erreur par défaut
    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
    });
};

module.exports = errorHandler;