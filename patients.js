const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Patient = require('../models/Patient');
const User = require('../models/User');

router.get('/', async (req, res) => {
  const patients = await Patient.find();
  res.json(patients);
});

router.post('/', async (req, res) => {
  const { name, age, gender, contact, address, medicalHistory } = req.body;

  const random6Digit = Math.floor(100000 + Math.random() * 900000);
  const username = `patient_${random6Digit}`;
  const plainPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    role: 'patient'
  });

  const patient = await Patient.create({
    name,
    age,
    gender,
    contact,
    address,
    medicalHistory,
    userId: user._id
  });

  res.status(201).json({
    patient,
    login: { username, password: plainPassword }
  });
});

router.delete('/:id', async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: 'Not found' });

  await User.findByIdAndDelete(patient.userId);
  await patient.deleteOne();

  res.json({ message: 'Deleted' });
});

module.exports = router;
