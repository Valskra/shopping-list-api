const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Le nom de l\'article est obligatoire'],
        trim: true,
        maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
    },
    quantity: {
        type: Number,
        default: 1,
        min: [1, 'La quantité doit être au moins de 1']
    },
    purchased: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['alimentaire', 'hygiène', 'ménage', 'autre'],
        default: 'autre'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);