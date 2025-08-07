# 🚗 دليل استخدام نظام السيارات المبسط

## 📋 نظرة عامة

نظام السيارات مبسط ويحتوي على **الحجم فقط** بدون أسماء أو أوصاف إضافية.

## 🎯 الأحجام المتاحة

| الحجم | القيمة | الوصف |
|-------|--------|-------|
| **صغيرة** | `small` | سيارات صغيرة مثل السيدان والهاتشباك |
| **متوسطة** | `medium` | سيارات متوسطة مثل SUV والكروس أوفر |
| **كبيرة** | `large` | سيارات كبيرة مثل الشاحنات والفانات |

## 🛣️ المسارات المتاحة

### 1. إنشاء سيارة جديدة
```http
POST /api/cars
Content-Type: application/json
Authorization: Bearer <token>

{
  "size": "small"
}
```

**الاستجابة:**
```json
{
  "message": "تم إنشاء السيارة بنجاح",
  "car": {
    "_id": "...",
    "size": "small",
    "sizeDisplayName": "صغيرة",
    "sizeDescription": "سيارات صغيرة مثل السيدان والهاتشباك",
    "isActive": true,
    "totalWashes": 0,
    "pricingInfo": {
      "name": "صغيرة",
      "description": "سيارات صغيرة مثل السيدان والهاتشباك",
      "examples": ["تويوتا كامري", "هوندا سيفيك", "نيسان سنترا"]
    }
  }
}
```

### 2. جلب جميع سيارات المستخدم
```http
GET /api/cars
Authorization: Bearer <token>
```

**الاستجابة:**
```json
{
  "message": "تم العثور على 2 سيارة",
  "cars": [
    {
      "_id": "...",
      "size": "small",
      "sizeDisplayName": "صغيرة",
      "totalWashes": 5
    },
    {
      "_id": "...",
      "size": "large",
      "sizeDisplayName": "كبيرة",
      "totalWashes": 2
    }
  ]
}
```

### 3. جلب سيارة محددة
```http
GET /api/cars/:id
Authorization: Bearer <token>
```

### 4. تحديث حجم السيارة
```http
PUT /api/cars/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "size": "medium"
}
```

### 5. حذف السيارة
```http
DELETE /api/cars/:id
Authorization: Bearer <token>
```

### 6. جلب الأحجام المتاحة
```http
GET /api/cars/sizes/available
```

**الاستجابة:**
```json
{
  "message": "الأحجام المتاحة",
  "sizes": [
    {
      "value": "small",
      "name": "صغيرة",
      "description": "سيارات صغيرة مثل السيدان والهاتشباك",
      "examples": ["تويوتا كامري", "هوندا سيفيك", "نيسان سنترا"],
      "pricing": {
        "basic": 150,
        "advanced": 280,
        "comprehensive": 490,
        "vip": 150
      }
    },
    {
      "value": "medium",
      "name": "متوسطة",
      "description": "سيارات متوسطة مثل SUV والكروس أوفر",
      "examples": ["تويوتا راف 4", "هوندا CR-V", "نيسان روغ"],
      "pricing": {
        "basic": 200,
        "advanced": 350,
        "comprehensive": 600,
        "vip": 150
      }
    },
    {
      "value": "large",
      "name": "كبيرة",
      "description": "سيارات كبيرة مثل الشاحنات والفانات",
      "examples": ["تويوتا لاند كروزر", "نيسان باترول", "شيفروليه تاهو"],
      "pricing": {
        "basic": 250,
        "advanced": 420,
        "comprehensive": 770,
        "vip": 150
      }
    }
  ]
}
```

## 💰 الأسعار حسب الحجم

| الحجم | الباقة الأساسية | الباقة المتقدمة | الباقة الشاملة | باقة VIP |
|-------|----------------|-----------------|----------------|----------|
| **صغيرة** | 150 ريال | 280 ريال | 490 ريال | **150 ريال** |
| **متوسطة** | 200 ريال | 350 ريال | 600 ريال | **150 ريال** |
| **كبيرة** | 250 ريال | 420 ريال | 770 ريال | **150 ريال** |

## ⚠️ القيود

1. **لا يمكن إضافة سيارة بنفس الحجم للمستخدم الواحد**
2. **باقة VIP ثابتة 150 ريال لجميع الأحجام**
3. **الحجم مطلوب في جميع العمليات**

## 🚀 أمثلة الاستخدام

### مثال 1: إنشاء سيارة صغيرة
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"size": "small"}'
```

### مثال 2: إنشاء سيارة متوسطة
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"size": "medium"}'
```

### مثال 3: إنشاء سيارة كبيرة
```bash
curl -X POST http://localhost:3000/api/cars \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"size": "large"}'
```

## 🎯 ملاحظات مهمة

- ✅ **الحجم فقط مطلوب** - لا حاجة لأسماء أو أوصاف
- ✅ **منع التكرار** - لا يمكن إضافة نفس الحجم مرتين
- ✅ **أسعار مختلفة** - كل حجم له أسعار مختلفة
- ✅ **VIP ثابت** - باقة VIP 150 ريال لجميع الأحجام
- ✅ **تتبع الغسيل** - عدد مرات الغسيل وتاريخ آخر غسيل 