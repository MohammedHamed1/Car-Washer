const Car = require('./car.model');

// إنشاء سيارة جديدة (حجم فقط)
exports.createCar = async (req, res) => {
  try {
    const { size } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!size) {
      return res.status(400).json({ 
        error: 'حجم السيارة مطلوب (small, medium, large)' 
      });
    }
    
    // التحقق من صحة الحجم
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size)) {
      return res.status(400).json({ 
        error: 'الحجم يجب أن يكون: small, medium, أو large' 
      });
    }
    
    // التحقق من عدم وجود سيارة بنفس الحجم للمستخدم
    const existingCar = await Car.findOne({ 
      user: req.user._id, 
      size, 
      isActive: true 
    });
    
    if (existingCar) {
      return res.status(400).json({ 
        error: 'لديك بالفعل سيارة بهذا الحجم' 
      });
    }
    
    const car = new Car({ 
      user: req.user._id,
      size
    });
    
    await car.save();
    
    // إرجاع السيارة مع المعلومات الإضافية
    const carWithInfo = car.toObject();
    carWithInfo.sizeDisplayName = car.sizeDisplayName;
    carWithInfo.sizeDescription = car.sizeDescription;
    carWithInfo.pricingInfo = car.getPricingInfo();
    
    res.status(201).json({
      message: 'تم إنشاء السيارة بنجاح',
      car: carWithInfo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// جلب جميع سيارات المستخدم
exports.getCars = async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id, isActive: true });
    
    // إضافة المعلومات الإضافية لكل سيارة
    const carsWithInfo = cars.map(car => {
      const carObj = car.toObject();
      carObj.sizeDisplayName = car.sizeDisplayName;
      carObj.sizeDescription = car.sizeDescription;
      carObj.pricingInfo = car.getPricingInfo();
      return carObj;
    });
    
    res.json({
      message: `تم العثور على ${carsWithInfo.length} سيارة`,
      cars: carsWithInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب سيارة محددة
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findOne({ 
      _id: req.params.id, 
      user: req.user._id,
      isActive: true 
    });
    
    if (!car) {
      return res.status(404).json({ error: 'السيارة غير موجودة' });
    }
    
    // إضافة المعلومات الإضافية
    const carWithInfo = car.toObject();
    carWithInfo.sizeDisplayName = car.sizeDisplayName;
    carWithInfo.sizeDescription = car.sizeDescription;
    carWithInfo.pricingInfo = car.getPricingInfo();
    
    res.json({
      message: 'تم العثور على السيارة',
      car: carWithInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// تحديث حجم السيارة
exports.updateCar = async (req, res) => {
  try {
    const { size } = req.body;
    
    if (!size) {
      return res.status(400).json({ 
        error: 'الحجم مطلوب للتحديث' 
      });
    }
    
    // التحقق من صحة الحجم
    const validSizes = ['small', 'medium', 'large'];
    if (!validSizes.includes(size)) {
      return res.status(400).json({ 
        error: 'الحجم يجب أن يكون: small, medium, أو large' 
      });
    }
    
    // التحقق من عدم وجود سيارة أخرى بنفس الحجم
    const existingCar = await Car.findOne({ 
      user: req.user._id, 
      size, 
      isActive: true,
      _id: { $ne: req.params.id }
    });
    
    if (existingCar) {
      return res.status(400).json({ 
        error: 'لديك بالفعل سيارة بهذا الحجم' 
      });
    }
    
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { size },
      { new: true }
    );
    
    if (!car) {
      return res.status(404).json({ error: 'السيارة غير موجودة' });
    }
    
    // إضافة المعلومات الإضافية
    const carWithInfo = car.toObject();
    carWithInfo.sizeDisplayName = car.sizeDisplayName;
    carWithInfo.sizeDescription = car.sizeDescription;
    carWithInfo.pricingInfo = car.getPricingInfo();
    
    res.json({
      message: 'تم تحديث السيارة بنجاح',
      car: carWithInfo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// حذف السيارة
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );
    
    if (!car) {
      return res.status(404).json({ error: 'السيارة غير موجودة' });
    }
    
    res.json({ message: 'تم حذف السيارة بنجاح' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// جلب معلومات الأحجام المتاحة
exports.getCarSizes = async (req, res) => {
  try {
    const sizes = [
      {
        value: 'small',
        name: 'صغيرة',
        description: 'سيارات صغيرة مثل السيدان والهاتشباك',
        examples: ['تويوتا كامري', 'هوندا سيفيك', 'نيسان سنترا'],
        pricing: {
          basic: 150,
          advanced: 280,
          comprehensive: 490,
          vip: 150 // ثابت لجميع الأحجام
        }
      },
      {
        value: 'medium',
        name: 'متوسطة',
        description: 'سيارات متوسطة مثل SUV والكروس أوفر',
        examples: ['تويوتا راف 4', 'هوندا CR-V', 'نيسان روغ'],
        pricing: {
          basic: 200,
          advanced: 350,
          comprehensive: 600,
          vip: 150 // ثابت لجميع الأحجام
        }
      },
      {
        value: 'large',
        name: 'كبيرة',
        description: 'سيارات كبيرة مثل الشاحنات والفانات',
        examples: ['تويوتا لاند كروزر', 'نيسان باترول', 'شيفروليه تاهو'],
        pricing: {
          basic: 250,
          advanced: 420,
          comprehensive: 770,
          vip: 150 // ثابت لجميع الأحجام
        }
      }
    ];
    
    res.json({
      message: 'الأحجام المتاحة',
      sizes: sizes
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 