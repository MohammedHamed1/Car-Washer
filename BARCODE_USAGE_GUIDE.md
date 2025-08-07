# 📱 دليل استخدام خدمات الباركود والـ QR

## 📋 نظرة عامة

خدمات الباركود والـ QR في نظام PayPass تتيح إنشاء وقراءة رموز QR مختلفة للاستخدامات المتعددة في النظام.

## 🎯 الوظائف المتاحة

### 1. **إنشاء QR Code أساسي**
```javascript
const { generateQRCode } = require('./services/barcode');

// إنشاء QR code بسيط
const qrCode = await generateQRCode('PAYPASS-12345');

// إنشاء QR code مع خيارات مخصصة
const qrCode = await generateQRCode('PAYPASS-12345', {
  width: 400,
  margin: 3,
  color: {
    dark: '#1a365d',
    light: '#f7fafc'
  },
  errorCorrectionLevel: 'H'
});
```

### 2. **إنشاء باركود فريد للمستخدم**
```javascript
const { generateUniqueBarcode } = require('./services/barcode');

// إنشاء باركود فريد
const barcode = generateUniqueBarcode('user123', 'package456');
// النتيجة: PAYPASS-user123-package456-1703123456789-abc123def456
```

### 3. **إنشاء باركود رقمي**
```javascript
const { generateNumericBarcode } = require('./services/barcode');

// إنشاء باركود رقمي من 12 رقم
const barcode = generateNumericBarcode(12);
// النتيجة: 123456789012

// إنشاء باركود رقمي من 8 أرقام
const barcode = generateNumericBarcode(8);
// النتيجة: 12345678
```

### 4. **إنشاء QR Code لحزمة المستخدم**
```javascript
const { generateUserPackageQR } = require('./services/barcode');

const userPackage = {
  barcode: 'PAYPASS-123-456-789',
  user: 'user123',
  package: 'package456',
  washesLeft: 5,
  expiry: '2024-12-31',
  status: 'active'
};

const qrCode = await generateUserPackageQR(userPackage);
```

### 5. **إنشاء QR Code لمحطة الغسيل**
```javascript
const { generateWashingPlaceQR } = require('./services/barcode');

const washingPlace = {
  _id: 'place123',
  name: 'محطة الغسيل الرئيسية',
  location: { lat: 24.7136, lng: 46.6753 },
  phone: '+966501234567'
};

const qrCode = await generateWashingPlaceQR(washingPlace);
```

### 6. **إنشاء QR Code للدفع**
```javascript
const { generatePaymentQR } = require('./services/barcode');

const payment = {
  _id: 'payment123',
  amount: 150,
  status: 'pending',
  createdAt: new Date()
};

const qrCode = await generatePaymentQR(payment);
```

### 7. **التحقق من صحة الباركود**
```javascript
const { validateBarcode } = require('./services/barcode');

// التحقق من باركود PAYPASS
const isValid1 = validateBarcode('PAYPASS-user123-package456-1234567890-abc123');
// النتيجة: true

// التحقق من باركود رقمي
const isValid2 = validateBarcode('123456789012');
// النتيجة: true

// التحقق من باركود غير صحيح
const isValid3 = validateBarcode('invalid-barcode');
// النتيجة: false
```

### 8. **استخراج معلومات من الباركود**
```javascript
const { extractBarcodeInfo } = require('./services/barcode');

// استخراج معلومات من باركود PAYPASS
const info1 = extractBarcodeInfo('PAYPASS-user123-package456-1234567890-abc123');
// النتيجة:
// {
//   type: 'paypass',
//   userId: 'user123',
//   packageId: 'package456',
//   timestamp: '1234567890',
//   random: 'abc123'
// }

// استخراج معلومات من باركود رقمي
const info2 = extractBarcodeInfo('123456789012');
// النتيجة:
// {
//   type: 'numeric',
//   value: '123456789012',
//   length: 12
// }
```

### 9. **إنشاء QR Code بتصميم مخصص**
```javascript
const { generateStyledQRCode } = require('./services/barcode');

const qrCode = await generateStyledQRCode('PAYPASS-12345', {
  width: 500,
  color: {
    dark: '#2d3748',  // رمادي داكن
    light: '#edf2f7'  // رمادي فاتح
  },
  errorCorrectionLevel: 'H'
});
```

## 📊 أنواع الباركود

### **1. باركود PAYPASS**
```
PAYPASS-{userId}-{packageId}-{timestamp}-{randomString}
```

**مثال:**
```
PAYPASS-user123-package456-1703123456789-abc123def456
```

### **2. باركود رقمي**
```
{8-16 رقم عشوائي}
```

**أمثلة:**
```
123456789012
987654321098
```

## 🎨 خيارات تصميم QR Code

### **الألوان المتاحة:**
```javascript
// ألوان افتراضية
{
  dark: '#000000',   // أسود
  light: '#FFFFFF'   // أبيض
}

// ألوان مخصصة
{
  dark: '#1a365d',   // أزرق داكن
  light: '#f7fafc'   // رمادي فاتح
}
```

### **مستويات تصحيح الأخطاء:**
- `L` - منخفض (7%)
- `M` - متوسط (15%) - **افتراضي**
- `Q` - عالي (25%)
- `H` - عالي جداً (30%)

### **الأحجام المتاحة:**
- `width`: 100-1000 بكسل
- `margin`: 0-10 بكسل

## 🔧 أمثلة الاستخدام في النظام

### **مثال 1: إنشاء QR Code عند شراء باقة**
```javascript
const { generateUserPackageQR, generateUniqueBarcode } = require('./services/barcode');

// عند إنشاء حزمة مستخدم جديدة
const barcode = generateUniqueBarcode(userId, packageId);
const qrCode = await generateUserPackageQR({
  barcode,
  user: userId,
  package: packageId,
  washesLeft: package.washes,
  expiry: expiryDate,
  status: 'active'
});
```

### **مثال 2: مسح QR Code في محطة الغسيل**
```javascript
const { extractBarcodeInfo, validateBarcode } = require('./services/barcode');

// عند مسح QR Code
const scannedData = 'PAYPASS-user123-package456-1234567890-abc123';

if (validateBarcode(scannedData)) {
  const info = extractBarcodeInfo(scannedData);
  if (info.type === 'paypass') {
    // البحث عن حزمة المستخدم
    const userPackage = await UserPackage.findOne({ barcode: scannedData });
    // معالجة الغسيل
  }
}
```

### **مثال 3: إنشاء QR Code للدفع**
```javascript
const { generatePaymentQR } = require('./services/barcode');

// عند إنشاء عملية دفع
const payment = await Payment.create({
  amount: 150,
  user: userId,
  package: packageId
});

const paymentQR = await generatePaymentQR(payment);
```

## ⚠️ ملاحظات مهمة

1. **أمان الباركود:** الباركود يحتوي على معلومات حساسة، تأكد من تشفيرها
2. **فترة الصلاحية:** QR Codes للدفع لها فترة صلاحية محدودة
3. **التخزين:** احفظ QR Codes كـ base64 strings في قاعدة البيانات
4. **الأداء:** QR Codes الكبيرة قد تؤثر على الأداء

## 🚀 أفضل الممارسات

1. **استخدم مستويات تصحيح أخطاء عالية** للـ QR Codes المهمة
2. **اختبر QR Codes** على أجهزة مختلفة
3. **احفظ نسخة احتياطية** من الباركود في قاعدة البيانات
4. **استخدم ألوان متباينة** لسهولة القراءة
5. **حدد حجم مناسب** حسب الاستخدام 