# 🚀 PayPass API - Postman Collection Setup Guide

## 📋 نظرة عامة

هذا الدليل يساعدك في إعداد واستخدام Postman Collection لاختبار جميع endpoints في نظام PayPass Car Wash Backend.

## 🎯 الملفات المطلوبة

1. **`PayPass_API_Collection.json`** - Collection الرئيسية
2. **`PayPass_Environment.json`** - Environment Variables
3. **`POSTMAN_SETUP_GUIDE.md`** - هذا الدليل

## ⚙️ خطوات الإعداد

### 1. استيراد Collection

1. افتح Postman
2. اضغط على **Import** في الأعلى
3. اختر **Upload Files**
4. ارفع ملف `PayPass_API_Collection.json`
5. اضغط **Import**

### 2. استيراد Environment

1. في Postman، اضغط على **Environments** في اليسار
2. اضغط **Import**
3. ارفع ملف `PayPass_Environment.json`
4. اضغط **Import**

### 3. تفعيل Environment

1. في الأعلى، اختر **PayPass Environment** من القائمة المنسدلة
2. تأكد من أن Environment مفعلة

## 🔐 خطوات الاختبار

### الخطوة 1: تسجيل مستخدم جديد

1. اذهب إلى **🔐 Authentication** → **Register User**
2. اضغط **Send**
3. احفظ `user_id` من الـ response

### الخطوة 2: تسجيل الدخول

1. اذهب إلى **🔐 Authentication** → **Login User**
2. اضغط **Send**
3. سيتم حفظ `auth_token` تلقائياً

### الخطوة 3: إنشاء سيارة

1. اذهب إلى **🚗 Car Module** → **Create Car**
2. اضغط **Send**
3. احفظ `car_id` من الـ response

### الخطوة 4: إنشاء باقة

1. اذهب إلى **📦 Package Module** → **Create Package**
2. اضغط **Send**
3. احفظ `package_id` من الـ response

### الخطوة 5: اختبار الدفع

1. اذهب إلى **💳 Payment Module** → **HyperPay Checkout**
2. اضغط **Send**
3. احفظ `checkout_id` من الـ response

## 🎨 ميزات Collection

### ✅ Test Scripts

- **Login User**: يحفظ `auth_token` تلقائياً
- **Create Car**: يحفظ `car_id` تلقائياً
- **Create Package**: يحفظ `package_id` تلقائياً
- **HyperPay Checkout**: يحفظ `checkout_id` تلقائياً

### 🔄 Environment Variables

| المتغير | الوصف | القيمة الافتراضية |
|---------|-------|-------------------|
| `base_url` | Base URL للـ API | `http://localhost:5000/api` |
| `auth_token` | JWT Token للمصادقة | (يتم حفظه تلقائياً) |
| `user_id` | ID المستخدم | (يتم حفظه يدوياً) |
| `car_id` | ID السيارة | (يتم حفظه تلقائياً) |
| `package_id` | ID الباقة | (يتم حفظه تلقائياً) |
| `payment_id` | ID الدفع | (يتم حفظه يدوياً) |
| `checkout_id` | ID Checkout | (يتم حفظه تلقائياً) |

## 🧪 اختبارات سريعة

### اختبار QR Code

```bash
# 1. إنشاء QR Code
POST {{base_url}}/packages/scan-qr
{
  "qrCode": "test_qr_code"
}

# 2. مسح QR Code
POST {{base_url}}/packages/scan-info
{
  "qrCode": "test_qr_code"
}
```

### اختبار HyperPay

```bash
# 1. إنشاء Checkout
POST {{base_url}}/payments/hyperpay-checkout
{
  "amount": 50,
  "paymentType": "card",
  "customerData": {
    "email": "test@example.com",
    "givenName": "Test",
    "surname": "User",
    "street": "123 Test Street",
    "city": "Riyadh",
    "state": "Riyadh",
    "country": "SA",
    "postcode": "12345"
  }
}

# 2. إنشاء دفع من HyperPay
POST {{base_url}}/payments/create-from-hyperpay
{
  "checkoutId": "{{checkout_id}}",
  "packageId": "{{package_id}}"
}
```

## 🚨 نصائح مهمة

### ⚠️ تحذيرات الأمان

1. **لا تشارك `auth_token`** مع أي شخص
2. **استخدم Environment Variables** بدلاً من القيم الثابتة
3. **احذف البيانات الحساسة** قبل مشاركة Collection

### 🔧 استكشاف الأخطاء

#### مشكلة في الاتصال
```bash
# تأكد من أن الخادم يعمل
curl http://localhost:5000/api/health
```

#### مشكلة في المصادقة
```bash
# تأكد من صحة Token
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me
```

#### مشكلة في HyperPay
```bash
# تأكد من إعدادات Environment
echo $HYPERPAY_BASE_URL
echo $HYPERPAY_ACCESS_TOKEN
```

## 📊 مراقبة الأداء

### Response Times

| Endpoint | الوقت المتوقع | الوصف |
|----------|---------------|-------|
| `/auth/login` | < 500ms | تسجيل الدخول |
| `/cars` | < 1s | قائمة السيارات |
| `/packages` | < 1s | قائمة الباقات |
| `/payments/hyperpay-checkout` | < 3s | إنشاء Checkout |
| `/packages/scan-qr` | < 2s | مسح QR Code |

### Status Codes

| الكود | الوصف | الإجراء |
|-------|-------|---------|
| 200 | نجح | ✅ |
| 201 | تم الإنشاء | ✅ |
| 400 | خطأ في البيانات | 🔍 تحقق من البيانات |
| 401 | غير مصرح | 🔑 تحقق من Token |
| 404 | غير موجود | 🔍 تحقق من ID |
| 500 | خطأ في الخادم | 🐛 تحقق من Logs |

## 🎯 أفضل الممارسات

### 1. ترتيب الاختبارات

```bash
# الترتيب الموصى به
1. Register User
2. Login User
3. Create Car
4. Create Package
5. Test Payment
6. Test QR
7. Test Feedback
```

### 2. تنظيف البيانات

```bash
# احذف البيانات بعد الاختبار
DELETE {{base_url}}/cars/{{car_id}}
DELETE {{base_url}}/packages/{{package_id}}
```

### 3. استخدام Pre-request Scripts

```javascript
// مثال: التحقق من وجود Token
if (!pm.environment.get('auth_token')) {
    console.log('No auth token found. Please login first.');
}
```

## 📞 الدعم

إذا واجهت أي مشاكل:

1. **تحقق من Logs**: `npm run dev` أو `npm start`
2. **تحقق من Environment**: تأكد من صحة المتغيرات
3. **تحقق من Network**: تأكد من الاتصال بالخادم
4. **تحقق من Database**: تأكد من اتصال MongoDB

## 🎉 تم!

الآن لديك Postman Collection كاملة لاختبار جميع endpoints في نظام PayPass. استمتع بالاختبار! 🚀
