const Habit = require('../models/Habit');

/* --------------------------------------
   Create Habit
-----------------------------------------*/
exports.createHabit = async (req, res) => {
  try {
    const data = req.body;

    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'User authentication missing' });
    }

    const ownerName = req.user.name || req.user.displayName || req.user.email;

    const habit = new Habit({
      ...data,
      ownerId: req.user.uid,
      ownerEmail: req.user.email,
      ownerName: ownerName,
    });

    const saved = await habit.save();
    res.json(saved);

  } catch (err) {
    console.error('Habit Creation Error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation failed', details: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   Get My Habits
-----------------------------------------*/
exports.getMine = async (req, res) => {
  try {
    const habits = await Habit.find({ ownerId: req.user.uid }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   ⭐ GET Single Habit (For Update Page)
-----------------------------------------*/
exports.getSingleHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    if (habit.ownerId !== req.user.uid)
      return res.status(403).json({ message: 'Not allowed' });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   Update Habit
-----------------------------------------*/
exports.updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Not found' });

    if (habit.ownerId !== req.user.uid)
      return res.status(403).json({ message: 'Forbidden' });

    // Update allowed fields
    const allowedUpdates = ['title', 'desc', 'category', 'reminder', 'image', 'isPublic'];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        habit[field] = req.body[field];
      }
    });

    const updated = await habit.save();
    res.json(updated);

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   Delete Habit
-----------------------------------------*/
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Not found' });

    if (habit.ownerId !== req.user.uid)
      return res.status(403).json({ message: 'Forbidden' });

    await Habit.findByIdAndDelete(req.params.id);

    res.json({ message: 'Deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   Mark Complete
-----------------------------------------*/
exports.markComplete = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit) return res.status(404).json({ message: 'Not found' });

    if (habit.ownerId !== req.user.uid)
      return res.status(403).json({ message: 'Forbidden' });

    const today = new Date();  
    today.setHours(0, 0, 0, 0);

    const alreadyDone = habit.completionHistory.some(
      (d) => new Date(d).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (alreadyDone)
      return res.status(400).json({ message: 'Already marked today' });

    habit.completionHistory.push(new Date());

    await habit.save();
    res.json(habit);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* --------------------------------------
   Public Habits
-----------------------------------------*/
exports.getPublicHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
