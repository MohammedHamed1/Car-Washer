# 🔄 العملية الكاملة لنظام الباركود والـ QR في PayPass

## 📋 نظرة عامة على العملية

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   المستخدم      │    │   النظام        │    │   محطة الغسيل   │
│   (Frontend)    │    │   (Backend)     │    │   (Scanner)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 المراحل الرئيسية

### **المرحلة 1: شراء الباقة وإنشاء الباركود**

```
┌─────────────────────────────────────────────────────────────────┐
│                   1. شراء الباقة                                │
├─────────────────────────────────────────────────────────────────┤
│ المستخدم ← يختار باقة ← يدفع ← النظام ← ينشئ حزمة مستخدم      │
│                                                                │
│ 📱 Frontend:                                                   │
│ - اختيار الباقة (أساسية/متقدمة/شاملة/VIP)                    │
│ - اختيار حجم السيارة (صغيرة/متوسطة/كبيرة)                    │
│ - الدفع عبر HyperPay                                           │
│                                                                │
│ 🔧 Backend:                                                    │
│ - إنشاء UserPackage                                            │
│ - إنشاء باركود فريد: PAYPASS-{userId}-{packageId}-{timestamp} │
│ - إنشاء QR Code                                                │
│                                                                │
│ 📄 النتيجة:                                                    │
│ - حزمة مستخدم جديدة                                            │
│ - باركود فريد                                                  │
│ - QR Code جاهز للاستخدام                                       │
└─────────────────────────────────────────────────────────────────┘
```

### **المرحلة 2: عرض الباركود للمستخدم**

```
┌─────────────────────────────────────────────────────────────────┐
│                   2. عرض الباركود                               │
├─────────────────────────────────────────────────────────────────┤
│ 📱 Frontend:                                                   │
│ - عرض QR Code في التطبيق                                       │
│ - إمكانية تحميل QR Code                                        │
│ - إمكانية طباعة QR Code                                        │
│                                                                │
│ 🎨 QR Code يحتوي على:                                          │
│ {                                                              │
│   "type": "user_package",                                      │
│   "barcode": "PAYPASS-123-456-789",                           │
│   "userId": "user123",                                         │
│   "packageId": "package456",                                   │
│   "washesLeft": 5,                                             │
│   "expiry": "2024-12-31",                                      │
│   "status": "active"                                           │
│ }                                                              │
└─────────────────────────────────────────────────────────────────┘
```

### **المرحلة 3: مسح الباركود في محطة الغسيل**

```
┌─────────────────────────────────────────────────────────────────┐
│                   3. مسح الباركود                               │
├─────────────────────────────────────────────────────────────────┤
│ 📱 محطة الغسيل:                                                │
│ - مسح QR Code بالكاميرا                                         │
│ - إرسال البيانات للخادم                                        │
│                                                                │
│ 🔧 Backend:                                                    │
│ POST /api/washes/scan-barcode                                  │
│ {                                                              │
│   "barcode": "PAYPASS-123-456-789",                           │
│   "washingPlace": "place123"                                   │
│ }                                                              │
│                                                                │
│ ✅ التحقق من:                                                   │
│ - صحة الباركود                                                 │
│ - صلاحية الحزمة                                                │
│ - وجود غسلات متبقية                                            │
│ - عدم انتهاء الصلاحية                                          │
└─────────────────────────────────────────────────────────────────┘
```

### **المرحلة 4: معالجة الغسيل**

```
┌─────────────────────────────────────────────────────────────────┐
│                   4. معالجة الغسيل                              │
├─────────────────────────────────────────────────────────────────┤
│ 🔧 Backend Processing:                                         │
│                                                                │
│ 1️⃣ البحث عن حزمة المستخدم:                                    │
│    UserPackage.findOne({ barcode, status: 'active' })         │
│                                                                │
│ 2️⃣ التحقق من الصلاحية:                                        │
│    - expiry > new Date()                                       │
│    - washesLeft > 0                                            │
│                                                                │
│ 3️⃣ خصم غسلة واحدة:                                             │
│    userPackage.washesLeft -= 1                                 │
│    if (washesLeft === 0) status = 'used'                      │
│                                                                │
│ 4️⃣ إنشاء سجل الغسيل:                                          │
│    new Wash({                                                  │
│      user: userPackage.user._id,                              │
│      washingPlace,                                             │
│      package: userPackage.package._id,                        │
│      status: 'completed',                                      │
│      owner: req.user._id                                       │
│    })                                                          │
│                                                                │
│ 5️⃣ إرسال إشعار للمستخدم:                                       │
│    sendNotification({                                          │
│      type: 'feedback',                                         │
│      message: 'يرجى تقييم الغسيل الأخير'                       │
│    })                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### **المرحلة 5: الاستجابة للمحطة**

```
┌─────────────────────────────────────────────────────────────────┐
│                   5. الاستجابة للمحطة                           │
├─────────────────────────────────────────────────────────────────┤
│ 📱 محطة الغسيل تستقبل:                                         │
│ {                                                              │
│   "success": true,                                             │
│   "user": {                                                    │
│     "name": "أحمد محمد",                                       │
│     "phone": "+966501234567"                                   │
│   },                                                           │
│   "carSize": "medium",                                         │
│   "package": {                                                 │
│     "name": "الباقة المتقدمة",                                 │
│     "features": ["غسيل شامل", "تلميع"]                        │
│   },                                                           │
│   "washesLeft": 4,                                             │
│   "expiry": "2024-12-31",                                      │
│   "wash": {                                                    │
│     "_id": "wash123",                                          │
│     "status": "completed",                                     │
│     "createdAt": "2024-01-15T10:30:00Z"                       │
│   }                                                            │
│ }                                                              │
│                                                                │
│ ✅ المحطة تعرض:                                                │
│ - معلومات المستخدم                                             │
│ - نوع الباقة                                                   │
│ - الغسلات المتبقية                                             │
│ - تأكيد نجاح العملية                                            │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 سير العملية التفصيلي

### **1. إنشاء الباركود (Backend)**

```javascript
// في userPackage.controller.js
const { generateUniqueBarcode, generateUserPackageQR } = require('../../services/barcode');

exports.createUserPackage = async (req, res) => {
  try {
    // 1. إنشاء باركود فريد
    const barcode = generateUniqueBarcode(userId, packageId);
    
    // 2. إنشاء حزمة المستخدم
    const userPackage = new UserPackage({
      user: userId,
      package: packageId,
      barcode: barcode,
      washesLeft: package.washes,
      expiry: expiryDate,
      status: 'active'
    });
    
    await userPackage.save();
    
    // 3. إنشاء QR Code
    const qrCode = await generateUserPackageQR(userPackage);
    
    res.json({
      success: true,
      userPackage,
      qrCode: qrCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **2. مسح الباركود (Backend)**

```javascript
// في wash.controller.js
const { validateBarcode, extractBarcodeInfo } = require('../../services/barcode');

exports.scanBarcodeAndDeductWash = async (req, res) => {
  try {
    const { barcode, washingPlace } = req.body;
    
    // 1. التحقق من صحة الباركود
    if (!validateBarcode(barcode)) {
      return res.status(400).json({ error: 'باركود غير صحيح' });
    }
    
    // 2. استخراج معلومات الباركود
    const barcodeInfo = extractBarcodeInfo(barcode);
    
    // 3. البحث عن حزمة المستخدم
    const userPackage = await UserPackage.findOne({
      barcode: barcode,
      status: 'active',
      expiry: { $gt: new Date() },
      washesLeft: { $gt: 0 }
    }).populate('user package');
    
    if (!userPackage) {
      return res.status(400).json({ 
        error: 'باركود غير صالح أو منتهي الصلاحية أو لا توجد غسلات متبقية' 
      });
    }
    
    // 4. خصم غسلة واحدة
    userPackage.washesLeft -= 1;
    if (userPackage.washesLeft === 0) {
      userPackage.status = 'used';
    }
    await userPackage.save();
    
    // 5. إنشاء سجل الغسيل
    const wash = new Wash({
      user: userPackage.user._id,
      washingPlace: washingPlace,
      package: userPackage.package._id,
      status: 'completed',
      owner: req.user._id
    });
    await wash.save();
    
    // 6. إرسال إشعار للمستخدم
    await sendNotification({
      user: userPackage.user._id,
      type: 'feedback',
      message: 'يرجى تقييم الغسيل الأخير وإضافة إكرامية اختيارية',
      relatedWash: wash._id
    });
    
    // 7. إرجاع النتيجة
    res.json({
      success: true,
      user: userPackage.user,
      carSize: userPackage.carSize,
      package: userPackage.package,
      washesLeft: userPackage.washesLeft,
      expiry: userPackage.expiry,
      wash: wash
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### **3. عرض الباركود (Frontend)**

```javascript
// في qrCode.js (Frontend)
async generatePackageQR(packageData) {
  try {
    const qrData = {
      type: 'user_package',
      packageId: packageData.id,
      userId: packageData.userId,
      packageType: packageData.packageType,
      washesLeft: packageData.washesLeft,
      expiresAt: packageData.expiresAt,
      createdAt: packageData.createdAt
    };

    const qrString = JSON.stringify(qrData);
    const qrImage = await this.generateQR(qrString);
    
    return {
      success: true,
      data: {
        qrImage,
        qrData,
        qrString
      }
    };
  } catch (error) {
    throw new Error('فشل في إنشاء رمز QR');
  }
}
```

## 🎯 أنواع الباركود المختلفة

### **1. باركود حزمة المستخدم**
```
PAYPASS-{userId}-{packageId}-{timestamp}-{randomString}
مثال: PAYPASS-user123-package456-1703123456789-abc123def456
```

### **2. باركود محطة الغسيل**
```json
{
  "type": "washing_place",
  "placeId": "place123",
  "name": "محطة الغسيل الرئيسية",
  "location": { "lat": 24.7136, "lng": 46.6753 },
  "phone": "+966501234567"
}
```

### **3. باركود الدفع**
```json
{
  "type": "payment",
  "paymentId": "payment123",
  "amount": 150,
  "currency": "SAR",
  "status": "pending",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## ⚠️ معالجة الأخطاء

### **أخطاء شائعة:**
1. **باركود غير صحيح** - التحقق من التنسيق
2. **حزمة منتهية الصلاحية** - التحقق من التاريخ
3. **لا توجد غسلات متبقية** - التحقق من العدد
4. **حزمة غير نشطة** - التحقق من الحالة

### **رسائل الخطأ:**
```javascript
// باركود غير صحيح
{ "error": "باركود غير صحيح" }

// حزمة منتهية الصلاحية
{ "error": "الحزمة منتهية الصلاحية" }

// لا توجد غسلات متبقية
{ "error": "لا توجد غسلات متبقية في الحزمة" }

// حزمة غير نشطة
{ "error": "الحزمة غير نشطة" }
```

## 🔒 الأمان

### **إجراءات الأمان:**
1. **تشفير البيانات** في الباركود
2. **التحقق من الصلاحية** في كل عملية
3. **تتبع العمليات** لتجنب الاستخدام المكرر
4. **مصادقة المستخدم** في العمليات الحساسة

### **التحقق من الأمان:**
```javascript
// التحقق من عدم استخدام الباركود مرتين
const existingWash = await Wash.findOne({
  userPackage: userPackage._id,
  createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // آخر 5 دقائق
});

if (existingWash) {
  return res.status(400).json({ error: 'تم استخدام هذا الباركود مؤخراً' });
}
```

## 📊 إحصائيات العملية

### **مؤشرات الأداء:**
- **وقت الاستجابة:** < 2 ثانية
- **معدل النجاح:** > 99%
- **معدل الأخطاء:** < 1%
- **الاستخدام اليومي:** حسب عدد المحطات

### **التتبع:**
- **عدد الغسلات اليومية**
- **أكثر الباقات استخداماً**
- **أوقات الذروة**
- **معدل رضا العملاء**

هذه العملية تضمن تجربة سلسة وآمنة للمستخدمين مع تتبع دقيق لجميع العمليات! 🎉 