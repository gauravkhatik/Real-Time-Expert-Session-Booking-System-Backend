const Expert = require('../models/Expert');
const Booking = require('../models/Booking');

// GET /api/experts
exports.list = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '10'));
    const search = req.query.search || '';
    const category = req.query.category || '';

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const total = await Expert.countDocuments(filter);
    const experts = await Expert.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data: experts, page, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/experts/:id
exports.get = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id).lean();
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    res.json(expert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/experts/:id/slots?start=YYYY-MM-DD&days=7
exports.slots = async (req, res) => {
  try {
    const expertId = req.params.id;
    const start = req.query.start || new Date().toISOString().slice(0,10);
    const days = Math.min(30, parseInt(req.query.days || '7'));

    // generate daily slots 09:00-17:00 hourly
    const slotsByDate = {};
    const dates = [];
    const startDate = new Date(start + 'T00:00:00');
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0,10);
      dates.push(key);
      slotsByDate[key] = [];
      for (let h = 9; h <= 16; h++) {
        const hh = h.toString().padStart(2,'0') + ':00';
        slotsByDate[key].push({ time: hh, available: true });
      }
    }

    // fetch bookings for expert in date range
    const bookings = await Booking.find({ expert: expertId, date: { $in: dates } }).lean();
    for (const b of bookings) {
      const arr = slotsByDate[b.date];
      if (!arr) continue;
      const slot = arr.find(s => s.time === b.timeSlot);
      if (slot) slot.available = false;
    }

    res.json({ start, days, slotsByDate });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/experts/categories
exports.categories = async (req, res) => {
  try {
    const cats = await Expert.distinct('category');
    res.json({ data: cats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
