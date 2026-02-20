require('dotenv').config();
const mongoose = require('mongoose');
const Expert = require('../models/Expert');

const experts = [
  { name: 'Alice Johnson', category: 'Data Science', experience: 8, rating: 4.8 },
  { name: 'Bob Martin', category: 'Web Development', experience: 5, rating: 4.5 },
  { name: 'Clara Lee', category: 'DevOps', experience: 6, rating: 4.7 },
  { name: 'Daniel Kim', category: 'Machine Learning', experience: 10, rating: 4.9 },
  { name: 'Eve Torres', category: 'Product Management', experience: 7, rating: 4.6 },
  { name: 'Frank Zhao', category: 'Mobile Development', experience: 4, rating: 4.3 },
  { name: 'Grace Park', category: 'Data Engineering', experience: 9, rating: 4.8 },
  { name: 'Hannah Singh', category: 'UX/UI Design', experience: 6, rating: 4.5 },
  { name: 'Ian Brooks', category: 'Cloud Architecture', experience: 11, rating: 4.9 },
  { name: 'Julia Perez', category: 'Security', experience: 8, rating: 4.7 },
  { name: 'Kevin Liu', category: 'QA & Testing', experience: 5, rating: 4.4 },
  { name: 'Lina Gomez', category: 'AI Ethics', experience: 3, rating: 4.2 }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://gauravkhatik806_db_user:ldJ71dfghLcyy2W9@cluster0.xwaoi5k.mongodb.net/');
  await Expert.deleteMany({});
  await Expert.insertMany(experts);
  console.log('Seeded experts');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
