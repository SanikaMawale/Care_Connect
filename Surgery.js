const mongoose = require('mongoose');

const surgerySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: String,

  status: {
    type: String,
    enum: ['scheduled', 'cancelled', 'rescheduled', 'completed'],
    default: 'scheduled'
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Surgery', surgerySchema);
