const router = require('express').Router();
const verify = require('../middleware/verifyFirebaseToken');
const ctrl = require('../controllers/habitController');

router.post('/', verify, ctrl.createHabit);
router.get('/mine', verify, ctrl.getMine);

// ⭐ Add this route
router.get('/:id', verify, ctrl.getSingleHabit);

router.put('/:id', verify, ctrl.updateHabit);
router.delete('/:id', verify, ctrl.deleteHabit);
router.post('/:id/complete', verify, ctrl.markComplete);

module.exports = router;
