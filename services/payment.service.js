// services/payment.service.js
const axios = require('axios');

class PaymentService {
  constructor() {
    this.baseUrl = process.env.HYPERPAY_BASE_URL;
    this.token = process.env.HYPERPAY_ACCESS_TOKEN;
    this.entityIdCard = process.env.HYPERPAY_ENTITY_ID_CARD;
    this.entityIdApplePay = process.env.HYPERPAY_ENTITY_ID_APPLEPAY;
    this.currency = process.env.HYPERPAY_CURRENCY || 'SAR';
  }

  async createCheckout({amount, paymentType = 'card', customerData}) {
    const entityId = paymentType === 'applepay' ? this.entityIdApplePay : this.entityIdCard;

    const payload = new URLSearchParams();
    payload.append('entityId', entityId);
    payload.append('amount', Number(amount).toFixed(2));
    payload.append('currency', this.currency);
    payload.append('paymentType', 'DB'); // as requested (DB)
    payload.append('merchantTransactionId', `tx_${Date.now()}`);
    // mandatory fields per provider
    payload.append('customer.email', customerData.email);
    payload.append('billing.street1', customerData.street || 'NA');
    payload.append('billing.city', customerData.city || 'NA');
    payload.append('billing.state', customerData.state || 'NA');
    payload.append('billing.country', customerData.country || 'SA');
    payload.append('billing.postcode', customerData.postcode || '00000');
    payload.append('customer.givenName', customerData.firstName || 'First');
    payload.append('customer.surname', customerData.lastName || 'Last');

    const res = await axios.post(`${this.baseUrl}/v1/checkouts`, payload.toString(), {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 15000
    });
    return res.data;
  }

  async getPaymentStatus(checkoutId, paymentType = 'card') {
    const entityId = paymentType === 'applepay' ? this.entityIdApplePay : this.entityIdCard;
    const res = await axios.get(`${this.baseUrl}/v1/checkouts/${checkoutId}/payment`, {
      headers: { Authorization: `Bearer ${this.token}` },
      params: { entityId },
      timeout: 15000
    });
    return res.data;
  }
}

module.exports = new PaymentService();
