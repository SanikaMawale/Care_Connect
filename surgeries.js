const express = require('express');
const Surgery = require('../models/Surgery');
const Appointment = require('../models/Appointment');
const router = express.Router();

/* =========================
   AUTO COMPLETE PAST SURGERIES
========================= */
const autoCompleteSurgeries = async () => {
  await Surgery.updateMany(
    {
      status: { $in: ['scheduled', 'rescheduled'] },
      date: { $lt: new Date() }
    },
    { $set: { status: 'completed' } }
  );
};

/* =========================
   GET ALL SURGERIES
========================= */
router.get('/', async (req, res) => {
  await autoCompleteSurgeries();

  const data = await Surgery.find()
    .populate('doctor')
    .populate('patient');

  res.json(data);
});

/* =========================
   GET TODAY'S SURGERIES
========================= */
router.get('/today', async (req, res) => {
  await autoCompleteSurgeries();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const data = await Surgery.find({
    date: { $gte: start, $lte: end },
    $or: [
      { status: 'scheduled' },
      { status: 'rescheduled' },
      { status: { $exists: false } }
    ]
  })
    .populate('doctor')
    .populate('patient');

  res.json(data);
});

/* =========================
   CREATE SURGERY
========================= */
router.post('/', async (req, res) => {
  try {
    const { doctor, patient, type, date, notes } = req.body;

    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    const surgeryConflict = await Surgery.findOne({
      doctor,
      status: 'scheduled',
      date: { $gte: startTime, $lt: endTime }
    });

    if (surgeryConflict) {
      return res.status(409).json({ message: 'Doctor already has a surgery at this time' });
    }

    const apptConflict = await Appointment.findOne({
      doctor,
      status: 'scheduled',
      date: { $gte: startTime, $lt: endTime }
    });

    if (apptConflict) {
      return res.status(409).json({ message: 'Doctor already has an appointment at this time' });
    }

    const surgery = new Surgery({
      doctor,
      patient,
      type,
      date: startTime,
      notes,
      status: 'scheduled'
    });

    await surgery.save();
    const populated = await surgery.populate('doctor patient');
    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CANCEL / RESCHEDULE / DELETE
========================= */
router.patch('/:id/cancel', async (req, res) => {
  const surgery = await Surgery.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );
  res.json(surgery);
});

router.patch('/:id/reschedule', async (req, res) => {
  const { date } = req.body;

  const surgery = await Surgery.findByIdAndUpdate(
    req.params.id,
    { date: new Date(date), status: 'rescheduled' },
    { new: true }
  );
  res.json(surgery);
});

router.delete('/:id', async (req, res) => {
  await Surgery.findByIdAndDelete(req.params.id);
  res.json({ message: 'Surgery deleted' });
});

module.exports = router;