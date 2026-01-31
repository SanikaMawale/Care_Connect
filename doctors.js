const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const Doctor = require('../models/Doctor');
const User = require('../models/User');

/* ======================
   GET all doctors
====================== */
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================
   GET single doctor  ✅ ADDED
====================== */
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ======================
   ADD doctor + login
====================== */
router.post('/', async (req, res) => {
  try {
    const { name, specialty, contact, experience } = req.body;

    // 🔐 Generate unique doctor username
    let username, exists = true;
    while (exists) {
      const rand = Math.floor(100000 + Math.random() * 900000);
      username = `doctor_${rand}`;
      exists = await User.findOne({ username });
    }

    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'doctor'
    });

    const doctor = await Doctor.create({
      name,
      specialty,
      contact,
      experience,
      userId: user._id
    });

    res.status(201).json({
      doctor,
      login: { username, password: plainPassword }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

/* ======================
   DELETE doctor
====================== */
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

    await User.findByIdAndDelete(doctor.userId);
    await doctor.deleteOne();

    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
