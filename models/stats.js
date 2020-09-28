const mongoose = require('mongoose');

const statsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: String,
    time: String
});

module.exports = mongoose.model('Stats', statsSchema);