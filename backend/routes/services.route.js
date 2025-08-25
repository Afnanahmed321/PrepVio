import express from 'express';
import Service from '../models/services.model.js'; // Ensure model path has .js extension

const router = express.Router();

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new service
router.post('/', async (req, res) => {
  const service = new Service({
    title: req.body.title,
    description: req.body.description,
  });
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET one service
router.get('/:id', getService, (req, res) => {
  res.json(res.service);
});

async function getService(req, res, next) {
  let service;
  try {
    service = await Service.findById(req.params.id);
    if (service == null) {
      return res.status(404).json({ message: 'Cannot find service' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.service = service;
  next();
}

export default router;
