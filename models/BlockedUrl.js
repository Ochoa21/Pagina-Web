const mongoose = require('mongoose');

const BlockedUrlSchema = new mongoose.Schema({
    url: { type: String, required: true }
});

module.exports = mongoose.model('BlockedUrl', BlockedUrlSchema);
