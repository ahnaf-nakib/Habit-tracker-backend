const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['Morning','Work','Fitness','Evening','Study'], default: 'Work' },
  reminderTime: { type: String }, // "07:00"
  imageUrl: { type: String },
  isPublic: { type: Boolean, default: false },
  ownerId: { type: String, required: true }, // firebase uid
  ownerName: { type: String },
  ownerEmail: { type: String },
  completionHistory: [{ type: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Habit', HabitSchema);
