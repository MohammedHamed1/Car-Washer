# PayPass API Documentation

## 🚀 نظام إدارة قاعدة البيانات التلقائي

### قاعدة البيانات متصلة تلقائياً وتحتوي على:

- ✅ **4 باقات أساسية** (الباقة الأساسية، المتقدمة، الشاملة، VIP)
- ✅ **4 مستخدمين** (مدير، موظف، مالك، مستخدم عادي)
- ✅ **6 أماكن غسيل** (3 فروع عادية + 3 فنادق VIP)
- ✅ **بيانات تجريبية** (سيارات، غسلات، مدفوعات)

---

## 📊 **Endpoints الرئيسية**

### 1. **إدارة قاعدة البيانات**

#### `POST /api/init-database`
تهيئة قاعدة البيانات تلقائياً
```bash
curl -X POST http://localhost:5000/api/init-database
```

#### `GET /api/database-status`
جلب حالة قاعدة البيانات
```bash
curl -X GET http://localhost:5000/api/database-status
```

#### `POST /api/reset-database`
إعادة تعيين قاعدة البيانات
```bash
curl -X POST http://localhost:5000/api/reset-database
```

#### `POST /api/fix-database`
إصلاح مشاكل قاعدة البيانات تلقائياً
```bash
curl -X POST http://localhost:5000/api/fix-database
```

### 2. **الباقات (Packages)**

#### `GET /api/packages`
جلب جميع الباقات
```bash
curl -X GET http://localhost:5000/api/packages
```

#### `POST /api/store-complete-packages`
خزن الباقات الأربع في قاعدة البيانات
```bash
curl -X POST http://localhost:5000/api/store-complete-packages
```

#### `POST /api/store-packages-json`
خزن الباقات في ملف JSON
```bash
curl -X POST http://localhost:5000/api/store-packages-json
```

### 3. **أماكن الغسيل (Washing Places)**

#### `GET /api/washingplaces`
جلب جميع أماكن الغسيل (فروع + فنادق)
```bash
curl -X GET http://localhost:5000/api/washingplaces
```

#### `POST /api/store-branches-washingplaces`
خزن الفروع العادية في جدول washingplaces
```bash
curl -X POST http://localhost:5000/api/store-branches-washingplaces
```

#### `POST /api/store-vip-hotels-washingplaces`
خزن فنادق VIP في جدول washingplaces
```bash
curl -X POST http://localhost:5000/api/store-vip-hotels-washingplaces
```

### 4. **الفروع والفنادق (Mock Data)**

#### `GET /api/branches`
جلب الفروع العادية
```bash
curl -X GET http://localhost:5000/api/branches
```

#### `GET /api/vip-hotels`
جلب فنادق VIP
```bash
curl -X GET http://localhost:5000/api/vip-hotels
```

#### `GET /api/locations`
جلب جميع المواقع
```bash
curl -X GET http://localhost:5000/api/locations
```

### 5. **الحالة الصحية**

#### `GET /api/health`
فحص حالة النظام
```bash
curl -X GET http://localhost:5000/api/health
```

#### `GET /api/test`
اختبار API
```bash
curl -X GET http://localhost:5000/api/test
```

---

## 🗄️ **هيكل قاعدة البيانات**

### **الباقات (Packages)**
```json
{
  "_id": "basic_package_001",
  "type": "basic",
  "name": "الباقة الأساسية",
  "nameEn": "Basic Package",
  "price": 150,
  "originalPrice": 235,
  "savings": 85,
  "washes": 5,
  "isVip": false,
  "carPrices": {
    "small": 150,
    "medium": 200,
    "large": 250
  }
}
```

### **المستخدمين (Users)**
```json
{
  "_id": "admin_user_001",
  "email": "admin@paypass.com",
  "role": "admin",
  "isActive": true,
  "isVerified": true
}
```

### **أماكن الغسيل (Washing Places)**
```json
{
  "_id": "branch_001",
  "name": "فرع الرياض - النخيل",
  "isMainBranch": true,
  "isVipEnabled": true,
  "isVipOnly": false,
  "isHotelBranch": false,
  "location": {
    "address": "شارع الملك فهد، حي النخيل، الرياض",
    "coordinates": {
      "latitude": 24.7136,
      "longitude": 46.6753
    }
  }
}
```

---

## 🔧 **الميزات التلقائية**

### **1. إدارة قاعدة البيانات التلقائية**
- ✅ فحص تلقائي لحالة قاعدة البيانات
- ✅ إنشاء البيانات المطلوبة تلقائياً
- ✅ إصلاح المشاكل تلقائياً
- ✅ تحديث البيانات عند الحاجة

### **2. نظام الباقات**
- ✅ 4 باقات أساسية فقط
- ✅ أسعار ديناميكية حسب حجم السيارة
- ✅ باقة VIP للفنادق فقط
- ✅ توفير واضح لكل باقة

### **3. نظام أماكن الغسيل**
- ✅ فروع عادية (3 فروع)
- ✅ فنادق VIP (3 فنادق)
- ✅ معلومات تفصيلية لكل مكان
- ✅ ساعات عمل وخدمات متاحة

### **4. نظام المستخدمين**
- ✅ مدير النظام: `admin@paypass.com` / `admin123`
- ✅ موظف: `employee@paypass.com` / `employee123`
- ✅ مالك: `owner@paypass.com` / `owner123`
- ✅ مستخدم عادي: `user@paypass.com` / `user123`

---

## 🚨 **حل المشاكل**

### **مشكلة: قاعدة البيانات فارغة**
```bash
# الحل: تهيئة قاعدة البيانات
curl -X POST http://localhost:5000/api/init-database
```

### **مشكلة: الباقات غير موجودة**
```bash
# الحل: إنشاء الباقات
curl -X POST http://localhost:5000/api/store-complete-packages
```

### **مشكلة: الفروع غير موجودة**
```bash
# الحل: إنشاء الفروع
curl -X POST http://localhost:5000/api/store-branches-washingplaces
```

### **مشكلة: فنادق VIP غير موجودة**
```bash
# الحل: إنشاء فنادق VIP
curl -X POST http://localhost:5000/api/store-vip-hotels-washingplaces
```

### **مشكلة: مشاكل عامة**
```bash
# الحل: إصلاح تلقائي
curl -X POST http://localhost:5000/api/fix-database
```

---

## 📈 **إحصائيات النظام**

### **البيانات الحالية:**
- 📦 **الباقات:** 4 باقات أساسية
- 👥 **المستخدمين:** 4 مستخدمين
- 🏢 **أماكن الغسيل:** 6 أماكن (3 فروع + 3 فنادق)
- 🚗 **السيارات:** 0 (يتم إنشاؤها عند الحاجة)
- 🧼 **الغسلات:** 0 (يتم إنشاؤها عند الحاجة)

### **حالة النظام:**
- ✅ **قاعدة البيانات:** متصلة
- ✅ **السيرفر:** يعمل
- ✅ **جميع Endpoints:** تعمل بشكل صحيح
- ✅ **البيانات:** متوفرة وجاهزة للاستخدام

---

## 🎯 **الاستخدام**

### **1. بدء النظام:**
```bash
npm run dev
```

### **2. فحص الحالة:**
```bash
curl -X GET http://localhost:5000/api/health
```

### **3. تهيئة قاعدة البيانات:**
```bash
curl -X POST http://localhost:5000/api/init-database
```

### **4. جلب البيانات:**
```bash
# الباقات
curl -X GET http://localhost:5000/api/packages

# أماكن الغسيل
curl -X GET http://localhost:5000/api/washingplaces

# حالة قاعدة البيانات
curl -X GET http://localhost:5000/api/database-status
```

---

## 🔐 **بيانات تسجيل الدخول**

### **للداشبورد:**
- **مدير:** `admin@paypass.com` / `admin123`
- **موظف:** `employee@paypass.com` / `employee123`
- **مالك:** `owner@paypass.com` / `owner123`

### **للتطبيق:**
- **مستخدم عادي:** `user@paypass.com` / `user123`

---

## 📞 **الدعم**

إذا واجهت أي مشاكل:

1. **فحص الحالة:** `GET /api/health`
2. **إصلاح تلقائي:** `POST /api/fix-database`
3. **إعادة تعيين:** `POST /api/reset-database`
4. **تهيئة جديدة:** `POST /api/init-database`

---

**تم تطوير هذا النظام ليعمل تلقائياً دون الحاجة لتدخل يدوي! 🚀** 