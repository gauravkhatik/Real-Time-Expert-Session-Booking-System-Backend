const Booking = require('../models/Booking');
const Expert = require('../models/Expert');

// POST /api/bookings
exports.create = async (req, res) => {
  try {
    const { expert, name, email, phone, date, timeSlot, notes } = req.body;
    if (!expert || !name || !email || !date || !timeSlot) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const expertExists = await Expert.findById(expert);
    if (!expertExists) return res.status(404).json({ error: 'Expert not found' });

    // Create booking - unique index on expert+date+timeSlot prevents duplicates
    const booking = new Booking({ expert, name, email, phone, date, timeSlot, notes });
    await booking.save();

    // Emit real-time update to clients viewing this expert
    if (req.io) {
      req.io.to(`expert_${expert}`).emit('bookingCreated', {
        expert,
        date,
        timeSlot,
      });
    }

    res.status(201).json({ data: booking });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Slot already booked' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/bookings?email=
exports.listByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ error: 'email query required' });
    const bookings = await Booking.find({ email }).populate('expert').sort({ date: -1 }).lean();
    res.json({ data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/bookings/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!['Pending','Confirmed','Completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
