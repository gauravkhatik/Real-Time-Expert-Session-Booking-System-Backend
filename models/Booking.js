const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'Expert', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  date: { type: String, required: true }, // YYYY-MM-DD
  timeSlot: { type: String, required: true }, // e.g., 09:00
  notes: { type: String },
  status: { type: String, enum: ['Pending','Confirmed','Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

// Prevent double booking for same expert, date and timeSlot
BookingSchema.index({ expert: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', BookingSchema);
