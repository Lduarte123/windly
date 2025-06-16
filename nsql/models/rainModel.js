const mongoose = require('mongoose');

const rainSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true,
    default: Date.now
  },
  chuva: {
    type: Boolean,
    required: true
  }
});

const Rain = mongoose.model('Rain', rainSchema);

module.exports = Rain;
