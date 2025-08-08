# HyperPay Integration Guide - PayPass Backend

## نظرة عامة

تم تكامل بوابة الدفع HyperPay مع دعم Apple Pay في نظام PayPass. يستخدم النظام البيانات الحقيقية للإنتاج.

## البيانات الحقيقية للإنتاج

### بيانات الوصول
- **Base URL**: `https://eu-prod.oppwa.com/`
- **Access Token**: `OGFjOWE0Y2Q5N2VlODI1NjAxOTgxMjMxMmU4ODI0ZDN8UlkrTTdFUXJMQ0prV015OlllPSM=`
- **Entity ID (Mada, Visa, MasterCard)**: `8ac9a4cd97ee825601981231c8f724df`
- **Apple Pay Entity ID**: `8ac9a4c998364f7e01983b83983b2207`

### بيانات التاجر
- **Email**: `joudmkhateb@gmail.com`
- **Password**: `Joodpaypass123`
- **Merchant Portal**: https://gate2play.ctpe.info/login

## طرق الدفع المدعومة

### 1. البطاقات الائتمانية
- **VISA**
- **MasterCard**
- **MADA**

### 2. Apple Pay
- يدعم Mada, Visa, MasterCard
- يتطلب جهاز iOS حقيقي للاختبار
- يعمل فقط في بيئة الإنتاج

## التكوين

### العملة والعملية
- **Currency**: SAR فقط
- **Payment Type**: DB (Debit فقط)
- **Minimum Amount**: 5 SAR
- **Maximum Amount**: 10,000 SAR

## الحقول المطلوبة

### الحقول الإلزامية
```javascript
{
  "merchantTransactionId": "PAYPASS_USER_PACKAGE_TIMESTAMP_RANDOM",
  "customer.email": "user@example.com",
  "billing.street1": "عنوان الشارع",
  "billing.city": "المدينة",
  "billing.state": "المنطقة",
  "billing.country": "SA",
  "billing.postcode": "الرمز البريدي",
  "customer.givenName": "الاسم الأول",
  "customer.surname": "اسم العائلة"
}
```

## نقاط النهاية API

### 1. إعداد الدفع
```http
POST /api/payments/prepare-checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "packageId": "package_id",
  "amount": 50,
  "paymentMethod": "CARD|APPLEPAY",
  "billingAddress": {
    "street1": "Test Street 123",
    "city": "Riyadh",
    "state": "Riyadh",
    "country": "SA",
    "postcode": "12345"
  }
}
```

### 2. الحصول على حالة الدفع
```http
GET /api/payments/status/{checkoutId}
Authorization: Bearer {token}
```

### 3. معالجة نتيجة الدفع (Webhook)
```http
POST /api/payments/result
Content-Type: application/json

{
  "id": "transaction_id",
  "result": {
    "status": "OK",
    "code": "000.100.110",
    "description": "Request successfully processed in 'Merchant in Integrator Test Mode'"
  },
  "amount": "50.00",
  "currency": "SAR",
  "merchantTransactionId": "PAYPASS_..."
}
```

### 4. الحصول على تكوين الدفع
```http
GET /api/payments/config
Authorization: Bearer {token}
```

### 5. الحصول على طرق الدفع المدعومة
```http
GET /api/payments/methods
Authorization: Bearer {token}
```

### 6. إنشاء واجهة الدفع
```http
GET /api/payments/widget/{checkoutId}?showApplePay=true
```

## Apple Pay Configuration

### إعدادات Apple Pay
```javascript
{
  "displayName": "MyStore",
  "total": { "label": "COMPANY, INC." },
  "supportedNetworks": ["mada", "masterCard", "visa"],
  "merchantCapabilities": ["supports3DS", "supportsCredit", "supportsDebit"],
  "countryCode": "SA",
  "supportedCountries": ["SA"],
  "version": 3
}
```

### CSS للتصميم
```css
.wpwl-apple-pay-button {
  -webkit-appearance: -apple-pay-button !important;
  font-size: 16px !important;
  display: block !important;
  width: 100% !important;
  -apple-pay-button-type: buy;
}
```

## أمثلة الاستخدام

### 1. إعداد دفع عادي
```javascript
const response = await fetch('/api/payments/prepare-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    packageId: 'package_id',
    amount: 50,
    paymentMethod: 'CARD',
    billingAddress: {
      street1: 'Test Street 123',
      city: 'Riyadh',
      state: 'Riyadh',
      country: 'SA',
      postcode: '12345'
    }
  })
});

const data = await response.json();
console.log('Checkout ID:', data.data.checkoutId);
console.log('Widget URL:', data.data.paymentWidgetUrl);
```

### 2. إعداد Apple Pay
```javascript
const response = await fetch('/api/payments/prepare-checkout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    packageId: 'package_id',
    amount: 50,
    paymentMethod: 'APPLEPAY',
    billingAddress: {
      street1: 'Test Street 123',
      city: 'Riyadh',
      state: 'Riyadh',
      country: 'SA',
      postcode: '12345'
    }
  })
});

const data = await response.json();
console.log('Apple Pay Config:', data.data.applePayConfig);
```

### 3. إنشاء واجهة الدفع
```html
<!DOCTYPE html>
<html>
<head>
  <title>PayPass Payment</title>
  <style>
    .wpwl-form {
      max-width: 100% !important;
    }
    .wpwl-apple-pay-button {
      -webkit-appearance: -apple-pay-button !important;
      font-size: 16px !important;
      display: block !important;
      width: 100% !important;
      -apple-pay-button-type: buy;
    }
  </style>
</head>
<body>
  <div id="payment-form"></div>
  
  <script src="https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId={checkoutId}"></script>
  <script>
    var wpwlOptions = {
      applePay: {
        displayName: "MyStore",
        total: { label: "COMPANY, INC." },
        supportedNetworks: ["mada","masterCard", "visa"],
        merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
        countryCode: "SA",
        supportedCountries: ["SA"],
        version: 3
      },
      onReady: function() {
        console.log('Payment widget ready');
      },
      onError: function(error) {
        console.error('Payment error:', error);
      },
      onSuccess: function(result) {
        console.log('Payment success:', result);
        // Handle successful payment
      }
    };
  </script>
</body>
</html>
```

## الاختبار

### اختبار الدفع العادي
1. استخدم مبلغ 5 SAR كحد أدنى
2. تأكد من إدخال جميع البيانات المطلوبة
3. اختبر مع بطاقات حقيقية

### اختبار Apple Pay
1. استخدم جهاز iOS حقيقي
2. تأكد من إعداد Apple Pay على الجهاز
3. اختبر مع بطاقات حقيقية مضافة لـ Apple Pay

## مراقبة المعاملات

### بوابة التاجر
- **URL**: https://gate2play.ctpe.info/login
- **Email**: joudmkhateb@gmail.com
- **Password**: سيتم إرسالها تلقائياً (تحقق من مجلد Spam)

### فترة التسوية
- **المدة**: 72 ساعة عادةً
- **الحد الأدنى للاختبار**: 5 SAR

## الأمان

### التحقق من صحة البيانات
- التحقق من مبلغ الدفع (5-10,000 SAR)
- التحقق من صحة بيانات الفواتير
- التحقق من صحة معرف المعاملة

### معالجة الأخطاء
```javascript
try {
  const result = await paymentService.prepareCheckout(paymentData);
  if (!result.success) {
    console.error('Payment error:', result.error);
    // Handle error
  }
} catch (error) {
  console.error('Payment service error:', error);
  // Handle service error
}
```

## استكشاف الأخطاء

### أخطاء شائعة
1. **Invalid Entity ID**: تأكد من استخدام Entity ID الصحيح
2. **Invalid Amount**: تأكد من أن المبلغ بين 5-10,000 SAR
3. **Missing Required Fields**: تأكد من إدخال جميع الحقول المطلوبة
4. **Apple Pay Not Available**: تأكد من استخدام جهاز iOS حقيقي

### سجلات الأخطاء
```javascript
console.error('Payment checkout preparation failed:', error.response?.data || error.message);
console.error('Apple Pay checkout preparation failed:', error.response?.data || error.message);
console.error('Payment status check failed:', error.response?.data || error.message);
```

## الدعم

للمساعدة في حالات المشاكل:
1. تحقق من سجلات الأخطاء
2. تأكد من صحة البيانات المدخلة
3. اختبر مع مبالغ صغيرة أولاً
4. اتصل بالدعم الفني إذا استمرت المشكلة
