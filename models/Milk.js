const mongoose = require('mongoose');

const MilkSchema = new mongoose.Schema({
    price:{
        type: Number,
        required: true
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Milk = mongoose.model('Milk', MilkSchema);

module.exports = Milk;