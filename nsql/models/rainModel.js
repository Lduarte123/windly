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
  },
  diasSemChuva: {
    type: [Boolean], // novo campo
    default: [false, false, false, false, false, false, false]
  }
});

const Rain = mongoose.model('Rain', rainSchema);

module.exports = Rain;
