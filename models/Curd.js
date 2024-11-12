const mongoose = require('mongoose');

const CurdSchema = new mongoose.Schema({
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

const Curd = mongoose.model('Curd', CurdSchema);

module.exports = Curd;