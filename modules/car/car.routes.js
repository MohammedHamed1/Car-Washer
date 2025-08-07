const express = require('express');
const router = express.Router();
const carController = require('./car.controller');
const auth = require('../../middleware/auth');

// مسارات السيارات
router.post('/', auth, carController.createCar);
router.get('/', auth, carController.getCars);
router.get('/:id', auth, carController.getCar);
router.put('/:id', auth, carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

// مسار جلب الأحجام المتاحة (لا يحتاج مصادقة)
router.get('/sizes/available', carController.getCarSizes);

module.exports = router; 