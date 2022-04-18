const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This file is required.'
    },
    description: {
        type: String,
        required: 'This file is required.'
    },
    email: {
        type: String,
        required: 'This file is required.'
    },
    ingredients: {
        type: Array,
        required: 'This file is required.'
    },
    category: {
        type: String,
        enum: ['Indian', 'Desserts', 'American', 'Italian', 'Chinese', 'Snacks', 'Sweets'],
        required: 'This file is required.'
    },
    image: {
        type: String,
        required: 'This file is required.'
    },

});

recipeSchema.index({ name: 'text', description: 'text' });
//recipeSchema.index({ "$**": 'text' });


module.exports = mongoose.model('Recipe', recipeSchema);