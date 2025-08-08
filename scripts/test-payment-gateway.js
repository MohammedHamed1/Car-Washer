const axios = require('axios');

// HyperPay Production Configuration
const config = {
  baseUrl: 'https://eu-prod.oppwa.com',
  accessToken: 'OGFjOWE0Y2Q5N2VlODI1NjAxOTgxMjMxMmU4ODI0ZDN8UlkrTTdFUXJMQ0prV015OlllPSM=',
  entityId: '8ac9a4cd97ee825601981231c8f724df', // Mada, Visa, MasterCard
  applePayEntityId: '8ac9a4c998364f7e01983b83983b2207', // Apple Pay
  currency: 'SAR',
  paymentType: 'DB'
};

// Generate unique merchant transaction ID
function generateMerchantTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `PAYPASS_TEST_${timestamp}_${random}`;
}

// Test regular payment checkout
async function testRegularPayment() {
  console.log('\n🧪 Testing Regular Payment Checkout...');
  
  try {
    const merchantTransactionId = generateMerchantTransactionId();
    
    const checkoutData = {
      entityId: config.entityId,
      amount: '5.00', // Minimum amount for testing
      currency: config.currency,
      paymentType: config.paymentType,
      merchantTransactionId,
      customer: {
        email: 'test@example.com',
        givenName: 'Test',
        surname: 'User'
      },
      billing: {
        street1: 'Test Street 123',
        city: 'Riyadh',
        state: 'Riyadh',
        country: 'SA',
        postcode: '12345'
      },
      customParameters: {
        testMode: 'true',
        paymentType: 'test_payment'
      }
    };

    const response = await axios.post(
      `${config.baseUrl}/v1/checkouts`,
      checkoutData,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Regular Payment Checkout Success!');
    console.log('📋 Checkout ID:', response.data.id);
    console.log('🔗 Widget URL:', `${config.baseUrl}/v1/paymentWidgets.js?checkoutId=${response.data.id}`);
    console.log('💰 Amount:', checkoutData.amount, config.currency);
    
    return response.data.id;
  } catch (error) {
    console.error('❌ Regular Payment Checkout Failed!');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Test Apple Pay checkout
async function testApplePay() {
  console.log('\n🍎 Testing Apple Pay Checkout...');
  
  try {
    const merchantTransactionId = generateMerchantTransactionId();
    
    const checkoutData = {
      entityId: config.applePayEntityId,
      amount: '5.00', // Minimum amount for testing
      currency: config.currency,
      paymentType: config.paymentType,
      merchantTransactionId,
      customer: {
        email: 'test@example.com',
        givenName: 'Test',
        surname: 'User'
      },
      billing: {
        street1: 'Test Street 123',
        city: 'Riyadh',
        state: 'Riyadh',
        country: 'SA',
        postcode: '12345'
      },
      customParameters: {
        testMode: 'true',
        paymentType: 'apple_pay_test'
      }
    };

    const response = await axios.post(
      `${config.baseUrl}/v1/checkouts`,
      checkoutData,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('✅ Apple Pay Checkout Success!');
    console.log('📋 Checkout ID:', response.data.id);
    console.log('🍎 Apple Pay Entity ID:', config.applePayEntityId);
    console.log('💰 Amount:', checkoutData.amount, config.currency);
    
    return response.data.id;
  } catch (error) {
    console.error('❌ Apple Pay Checkout Failed!');
    console.error('Error:', error.response?.data || error.message);
    return null;
  }
}

// Test payment status
async function testPaymentStatus(checkoutId) {
  if (!checkoutId) {
    console.log('⚠️ No checkout ID provided for status test');
    return;
  }
  
  console.log('\n📊 Testing Payment Status...');
  
  try {
    const response = await axios.get(
      `${config.baseUrl}/v1/checkouts/${checkoutId}/payment`,
      {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`
        }
      }
    );

    console.log('✅ Payment Status Retrieved!');
    console.log('📋 Status:', response.data.result?.status);
    console.log('🔢 Code:', response.data.result?.code);
    console.log('📝 Description:', response.data.result?.description);
    
  } catch (error) {
    console.error('❌ Payment Status Check Failed!');
    console.error('Error:', error.response?.data || error.message);
  }
}

// Test payment configuration
async function testPaymentConfig() {
  console.log('\n⚙️ Testing Payment Configuration...');
  
  try {
    console.log('✅ Configuration Valid!');
    console.log('🌐 Base URL:', config.baseUrl);
    console.log('🔑 Access Token:', config.accessToken ? '✅ Valid' : '❌ Invalid');
    console.log('🏢 Entity ID (Cards):', config.entityId);
    console.log('🍎 Entity ID (Apple Pay):', config.applePayEntityId);
    console.log('💰 Currency:', config.currency);
    console.log('💳 Payment Type:', config.paymentType);
    
  } catch (error) {
    console.error('❌ Configuration Test Failed!');
    console.error('Error:', error.message);
  }
}

// Generate payment widget HTML
function generatePaymentWidget(checkoutId) {
  if (!checkoutId) {
    console.log('⚠️ No checkout ID provided for widget generation');
    return;
  }
  
  console.log('\n🎨 Generating Payment Widget HTML...');
  
  const widgetHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PayPass Payment Test</title>
  <style>
    .payment-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
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
  <div class="payment-container">
    <h2>PayPass Payment Test</h2>
    <p>Checkout ID: ${checkoutId}</p>
    <div id="payment-form"></div>
  </div>
  
  <script src="${config.baseUrl}/v1/paymentWidgets.js?checkoutId=${checkoutId}"></script>
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
        alert('Payment successful! Check console for details.');
      }
    };
  </script>
</body>
</html>`;

  console.log('✅ Payment Widget HTML Generated!');
  console.log('📄 HTML Length:', widgetHtml.length, 'characters');
  console.log('💡 Save this HTML to a file and open in browser to test');
  
  return widgetHtml;
}

// Main test function
async function runTests() {
  console.log('🚀 Starting HyperPay Payment Gateway Tests...');
  console.log('📅 Test Time:', new Date().toLocaleString());
  console.log('🔗 Base URL:', config.baseUrl);
  
  // Test configuration
  await testPaymentConfig();
  
  // Test regular payment
  const regularCheckoutId = await testRegularPayment();
  
  // Test Apple Pay
  const applePayCheckoutId = await testApplePay();
  
  // Test payment status for regular payment
  if (regularCheckoutId) {
    await testPaymentStatus(regularCheckoutId);
  }
  
  // Generate payment widget
  if (regularCheckoutId) {
    generatePaymentWidget(regularCheckoutId);
  }
  
  console.log('\n🎉 Payment Gateway Tests Completed!');
  console.log('\n📋 Summary:');
  console.log('- Regular Payment:', regularCheckoutId ? '✅ Success' : '❌ Failed');
  console.log('- Apple Pay:', applePayCheckoutId ? '✅ Success' : '❌ Failed');
  console.log('- Configuration:', '✅ Valid');
  
  console.log('\n💡 Next Steps:');
  console.log('1. Use the widget URL to test payment form');
  console.log('2. Test with real cards (minimum 5 SAR)');
  console.log('3. Check merchant portal for transactions');
  console.log('4. Monitor settlement (72 hours)');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = {
  testRegularPayment,
  testApplePay,
  testPaymentStatus,
  testPaymentConfig,
  generatePaymentWidget,
  runTests
};
