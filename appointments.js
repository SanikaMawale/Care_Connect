const express = require('express');
const Appointment = require('../models/Appointment');
const Surgery = require('../models/Surgery');
const router = express.Router();

/* =========================
   AUTO COMPLETE PAST APPOINTMENTS
========================= */
const autoCompleteAppointments = async () => {
  await Appointment.updateMany(
    {
      status: { $in: ['scheduled', 'rescheduled'] },
      date: { $lt: new Date() }
    },
    { $set: { status: 'completed' } }
  );
};

/* =========================
   GET ALL APPOINTMENTS
========================= */
router.get('/', async (req, res) => {
  await autoCompleteAppointments();

  const data = await Appointment.find()
    .populate('doctor')
    .populate('patient');

  res.json(data);
});

/* =========================
   GET TODAY'S APPOINTMENTS
========================= */
router.get('/today', async (req, res) => {
  await autoCompleteAppointments();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const data = await Appointment.find({
    date: { $gte: start, $lte: end },
    $or: [
      { status: 'scheduled' },
      { status: 'rescheduled' },
      { status: { $exists: false } } // legacy data
    ]
  })
    .populate('doctor')
    .populate('patient');

  res.json(data);
});

/* =========================
   CREATE APPOINTMENT
========================= */
router.post('/', async (req, res) => {
  try {
    const { doctor, patient, date, notes } = req.body;

    if (!doctor || !patient || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + 30 * 60000);

    const doctorApptConflict = await Appointment.findOne({
      doctor,
      status: 'scheduled',
      date: { $gte: startTime, $lt: endTime }
    });

    if (doctorApptConflict) {
      return res.status(409).json({ message: 'Doctor already has an appointment at this time' });
    }

    const doctorSurgeryConflict = await Surgery.findOne({
      doctor,
      status: 'scheduled',
      date: { $gte: startTime, $lt: endTime }
    });

    if (doctorSurgeryConflict) {
      return res.status(409).json({ message: 'Doctor already has a surgery at this time' });
    }

    const patientConflict = await Appointment.findOne({
      patient,
      status: 'scheduled',
      date: { $gte: startTime, $lt: endTime }
    });

    if (patientConflict) {
      return res.status(409).json({ message: 'Patient already has an appointment at this time' });
    }

    const appt = await Appointment.create({
      doctor,
      patient,
      date: startTime,
      notes,
      status: 'scheduled'
    });

    const populated = await appt.populate('doctor patient');
    res.status(201).json(populated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   CANCEL / RESCHEDULE / DELETE
========================= */
router.patch('/:id/cancel', async (req, res) => {
  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: 'cancelled' },
    { new: true }
  );
  res.json(appt);
});

router.patch('/:id/reschedule', async (req, res) => {
  const { date } = req.body;

  const appt = await Appointment.findByIdAndUpdate(
    req.params.id,
    { date: new Date(date), status: 'rescheduled' },
    { new: true }
  );
  res.json(appt);
});

router.delete('/:id', async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: 'Appointment deleted' });
});

module.exports = router;