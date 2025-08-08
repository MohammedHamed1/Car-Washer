# 🚀 PayPass Backend - Complete Setup Guide

## 📋 نظرة عامة

هذا الدليل الشامل يغطي جميع جوانب إعداد وتشغيل نظام PayPass Car Wash Backend مع بوابة الدفع HyperPay و Apple Pay.

## 🎯 الملفات المطلوبة

### 📁 الملفات الأساسية
- `services/payment.service.js` - خدمة الدفع المحدثة
- `seed-database.js` - سكربت تهيئة قاعدة البيانات
- `quick-test-with-seed-and-payments.js` - سكربت الاختبار الشامل
- `test-all-endpoints.js` - سكربت اختبار جميع الـ endpoints

### 📁 ملفات Postman
- `PayPass_API_Collection.json` - Collection الرئيسية
- `PayPass_Environment.json` - Environment Variables
- `POSTMAN_SETUP_GUIDE.md` - دليل Postman

### 📁 ملفات التوثيق
- `HYPERPAY_INTEGRATION_GUIDE.md` - دليل HyperPay
- `README_COMPLETE_SETUP.md` - هذا الدليل

## ⚙️ خطوات الإعداد

### 1. تحديث ملف `.env`

```env
# API
VITE_API_BASE_URL=https://car-washer-production.up.railway.app/api

# Database
MONGODB_URI=mongodb+srv://CarWasherDB:Password%40%23%24123456789@dartabases.aqbbmr9.mongodb.net/paypass?retryWrites=true&w=majority&appName=DartaBases

# Auth
JWT_SECRET=mySecretKey

# HyperPay (LIVE) — حذر: هذه بيانات حقيقية
HYPERPAY_BASE_URL=https://eu-prod.oppwa.com
HYPERPAY_ACCESS_TOKEN=OGFjOWE0Y2Q5N2VlODI1NjAxOTgxMjMxMmU4ODI0ZDN8UlkrTTdFUXJMQ0prV015OlllPSM=
HYPERPAY_ENTITY_ID_CARD=8ac9a4cd97ee825601981231c8f724df
HYPERPAY_ENTITY_ID_APPLEPAY=8ac9a4c998364f7e01983b83983b2207
HYPERPAY_CURRENCY=SAR

# Test user for payment (live account email/password supplied)
TEST_USER_EMAIL=joudmkhateb@gmail.com
TEST_USER_PASSWORD=Joodpaypass123

# (Optional) set API_BASE for scripts
API_BASE_URL=http://localhost:5000/api
```

### 2. تثبيت المتطلبات

```bash
npm install
```

### 3. تشغيل الخادم

```bash
# Development
npm run dev

# Production
npm start
```

## 🧪 الاختبارات

### 1. اختبار سريع شامل

```bash
# اختبار شامل مع تهيئة البيانات والدفع
npm run quick-test
```

### 2. اختبار جميع الـ endpoints

```bash
# اختبار جميع الـ endpoints
npm run test:all-endpoints
```

### 3. اختبار بوابة الدفع

```bash
# اختبار HyperPay فقط
npm run test:gateway-quick
```

### 4. اختبارات Jest

```bash
# جميع الاختبارات
npm run test:all

# اختبارات الدفع
npm run test:payment

# اختبارات QR
npm run test:qr
```

## 📊 Postman Collection

### 1. استيراد Collection

1. افتح Postman
2. اضغط **Import**
3. ارفع `PayPass_API_Collection.json`
4. ارفع `PayPass_Environment.json`
5. فعّل Environment

### 2. خطوات الاختبار

1. **Register User** → احفظ `user_id`
2. **Login User** → يحفظ `auth_token` تلقائياً
3. **Create Car** → يحفظ `car_id` تلقائياً
4. **Create Package** → يحفظ `package_id` تلقائياً
5. **HyperPay Checkout** → يحفظ `checkout_id` تلقائياً

## 🔐 بوابة الدفع HyperPay

### البيانات الحقيقية

- **Base URL**: `https://eu-prod.oppwa.com/`
- **Access Token**: `OGFjOWE0Y2Q5N2VlODI1NjAxOTgxMjMxMmU4ODI0ZDN8UlkrTTdFUXJMQ0prV015OlllPSM=`
- **Entity ID (Card)**: `8ac9a4cd97ee825601981231c8f724df`
- **Entity ID (Apple Pay)**: `8ac9a4c998364f7e01983b83983b2207`

### طرق الدفع المدعومة

1. **البطاقات الائتمانية**
   - VISA
   - MasterCard
   - MADA

2. **Apple Pay**
   - يدعم Mada, Visa, MasterCard
   - يتطلب جهاز iOS حقيقي
   - يعمل فقط في بيئة الإنتاج

## 🎨 ميزات النظام

### ✅ الميزات المكتملة

- [x] نظام المصادقة (JWT)
- [x] إدارة السيارات
- [x] إدارة الباقات
- [x] نظام الدفع (HyperPay + Apple Pay)
- [x] نظام QR Code
- [x] نظام التقييمات
- [x] نظام الإشعارات
- [x] نظام الإحالة
- [x] إدارة حزم المستخدمين

### 🔄 الميزات الجارية

- [ ] تحسينات الأمان
- [ ] تحسينات الأداء
- [ ] إضافة المزيد من طرق الدفع

## 🚨 تحذيرات مهمة

### ⚠️ الأمان

1. **لا تشارك البيانات الحساسة**
   - Access Tokens
   - Passwords
   - Database URIs

2. **استخدم Environment Variables**
   - لا تضع البيانات الحساسة في الكود
   - استخدم `.env` للمتغيرات المحلية

3. **احمِ ملف `.env`**
   - أضفه إلى `.gitignore`
   - لا ترفعه إلى Git

### ⚠️ الدفع

1. **بيانات حقيقية**
   - HyperPay يستخدم بيانات حقيقية
   - أي دفعة ستُخصم فعلياً
   - اختبر في بيئة اختبارية أولاً

2. **Apple Pay**
   - يتطلب جهاز iOS حقيقي
   - لا يعمل في المحاكي
   - اختبر على جهاز حقيقي

## 📞 الدعم والاستكشاف

### 🔧 استكشاف الأخطاء

#### مشكلة في الاتصال
```bash
# تأكد من أن الخادم يعمل
curl http://localhost:5000/api/health
```

#### مشكلة في Database
```bash
# تأكد من اتصال MongoDB
npm run test-db
```

#### مشكلة في الدفع
```bash
# تأكد من إعدادات HyperPay
npm run test:gateway-quick
```

### 📊 مراقبة الأداء

#### Response Times
- Authentication: < 500ms
- CRUD Operations: < 1s
- Payment Processing: < 3s
- QR Code Scanning: < 2s

#### Status Codes
- 200: نجح
- 201: تم الإنشاء
- 400: خطأ في البيانات
- 401: غير مصرح
- 404: غير موجود
- 500: خطأ في الخادم

## 🎯 أفضل الممارسات

### 1. ترتيب الاختبارات

```bash
# الترتيب الموصى به
1. npm run seed          # تهيئة البيانات
2. npm run quick-test    # اختبار شامل
3. npm run test:all      # اختبارات Jest
```

### 2. تنظيف البيانات

```bash
# احذف البيانات بعد الاختبار
DELETE /api/cars/{car_id}
DELETE /api/packages/{package_id}
```

### 3. استخدام Postman

```bash
# استخدم Collection للاختبارات
1. Import PayPass_API_Collection.json
2. Import PayPass_Environment.json
3. فعّل Environment
4. ابدأ بالـ Authentication
```

## 📈 التطوير المستقبلي

### 🎯 الميزات المخططة

1. **تحسينات الأمان**
   - Rate Limiting
   - Input Validation
   - SQL Injection Protection

2. **تحسينات الأداء**
   - Caching
   - Database Optimization
   - CDN Integration

3. **ميزات جديدة**
   - Push Notifications
   - Real-time Updates
   - Analytics Dashboard

## 🎉 تم!

الآن لديك نظام PayPass Car Wash Backend كامل ومتطور مع:

- ✅ بوابة دفع HyperPay مع Apple Pay
- ✅ نظام QR Code متكامل
- ✅ اختبارات شاملة
- ✅ توثيق مفصل
- ✅ Postman Collection
- ✅ سكربتات مساعدة

استمتع بالتطوير! 🚀
