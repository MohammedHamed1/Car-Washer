const Payment = require('../models/payment.model');
const User = require('../models/user.model');
const Package = require('../models/package.model');
const UserPackage = require('../models/userPackage.model');
const paymentService = require('../services/payment.service');
const barcodeService = require('../services/barcode.service');

class PaymentController {
  /**
   * Prepare payment checkout
   */
  async prepareCheckout(req, res) {
    try {
      const { packageId, amount, paymentMethod = 'CARD' } = req.body;
      const userId = req.user._id;

      // Validate required fields
      if (!packageId || !amount) {
        return res.error(400, 'Package ID and amount are required');
      }

      // Validate payment amount
      const amountValidation = paymentService.validatePaymentAmount(amount);
      if (!amountValidation.valid) {
        return res.error(400, amountValidation.error);
      }

      // Get user data
      const user = await User.findById(userId);
      if (!user) {
        return res.error(404, 'User not found');
      }

      // Get package data
      const packageData = await Package.findById(packageId);
      if (!packageData) {
        return res.error(404, 'Package not found');
      }

      // Prepare billing address (you might want to get this from user profile)
      const billingAddress = {
        street1: req.body.billingAddress?.street1 || 'Default Street',
        city: req.body.billingAddress?.city || 'Riyadh',
        state: req.body.billingAddress?.state || 'Riyadh',
        country: req.body.billingAddress?.country || 'SA',
        postcode: req.body.billingAddress?.postcode || '12345'
      };

      const paymentData = {
        amount,
        userId: userId.toString(),
        packageId: packageId.toString(),
        userEmail: user.email,
        userData: {
          firstName: user.name.split(' ')[0] || user.name,
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          name: user.name
        },
        billingAddress
      };

      // Prepare checkout based on payment method
      let checkoutResult;
      if (paymentMethod === 'APPLEPAY') {
        checkoutResult = await paymentService.prepareApplePayCheckout(paymentData);
      } else {
        checkoutResult = await paymentService.prepareCheckout(paymentData);
      }

      if (!checkoutResult.success) {
        return res.error(400, checkoutResult.error);
      }

      // Create pending payment record
      const payment = new Payment({
        user: userId,
        package: packageId,
        amount,
        method: paymentMethod,
        status: 'pending',
        transactionId: checkoutResult.merchantTransactionId,
        checkoutId: checkoutResult.checkoutId
      });

      await payment.save();

      return res.success(200, 'Payment checkout prepared successfully', {
        checkoutId: checkoutResult.checkoutId,
        merchantTransactionId: checkoutResult.merchantTransactionId,
        paymentWidgetUrl: checkoutResult.paymentWidgetUrl,
        applePayConfig: checkoutResult.applePayConfig,
        paymentId: payment._id
      });

    } catch (error) {
      console.error('Payment checkout preparation error:', error);
      return res.error(500, 'Failed to prepare payment checkout');
    }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(req, res) {
    try {
      const { checkoutId } = req.params;

      if (!checkoutId) {
        return res.error(400, 'Checkout ID is required');
      }

      const statusResult = await paymentService.getPaymentStatus(checkoutId);
      
      if (!statusResult.success) {
        return res.error(400, statusResult.error);
      }

      // Update payment record if found
      const payment = await Payment.findOne({ checkoutId });
      if (payment) {
        payment.status = statusResult.status === 'OK' ? 'completed' : 'failed';
        payment.transactionId = statusResult.transactionId;
        payment.result = statusResult.data;
        await payment.save();
      }

      return res.success(200, 'Payment status retrieved successfully', statusResult);

    } catch (error) {
      console.error('Payment status check error:', error);
      return res.error(500, 'Failed to get payment status');
    }
  }

  /**
   * Process payment result (webhook)
   */
  async processPaymentResult(req, res) {
    try {
      const resultData = req.body;

      if (!resultData || !resultData.id) {
        return res.error(400, 'Invalid payment result data');
      }

      const paymentResult = await paymentService.processPaymentResult(resultData);
      
      if (!paymentResult.success) {
        return res.error(400, paymentResult.error);
      }

      // Update payment record
      const payment = await Payment.findOne({ 
        merchantTransactionId: paymentResult.merchantTransactionId 
      });

      if (payment) {
        payment.status = paymentResult.success ? 'completed' : 'failed';
        payment.transactionId = paymentResult.transactionId;
        payment.result = resultData;
        await payment.save();

        // If payment successful, create user package
        if (paymentResult.success) {
          await this.createUserPackage(paymentResult);
        }
      }

      return res.success(200, 'Payment result processed successfully', paymentResult);

    } catch (error) {
      console.error('Payment result processing error:', error);
      return res.error(500, 'Failed to process payment result');
    }
  }

  /**
   * Create user package after successful payment
   */
  async createUserPackage(paymentResult) {
    try {
      const { userId, packageId, amount } = paymentResult;

      // Get package details
      const packageData = await Package.findById(packageId);
      if (!packageData) {
        throw new Error('Package not found');
      }

      // Generate barcode for user package
      const barcode = barcodeService.generateUniqueBarcode(userId, packageId);
      const barcodeImage = await barcodeService.generateQRCode(barcode);

      // Create user package
      const userPackage = new UserPackage({
        user: userId,
        package: packageId,
        washesLeft: packageData.washes,
        expiry: new Date(Date.now() + packageData.duration * 24 * 60 * 60 * 1000),
        status: 'active',
        barcode,
        barcodeImage,
        paymentId: paymentResult.transactionId
      });

      await userPackage.save();

      console.log(`User package created successfully for user ${userId}`);

    } catch (error) {
      console.error('Failed to create user package:', error);
      throw error;
    }
  }

  /**
   * Get payment configuration
   */
  async getPaymentConfig(req, res) {
    try {
      const config = paymentService.getPaymentConfig();
      
      return res.success(200, 'Payment configuration retrieved successfully', config);

    } catch (error) {
      console.error('Payment config error:', error);
      return res.error(500, 'Failed to get payment configuration');
    }
  }

  /**
   * Get user payments
   */
  async getUserPayments(req, res) {
    try {
      const userId = req.user._id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { user: userId };
      if (status) {
        query.status = status;
      }

      const payments = await Payment.find(query)
        .populate('package', 'name price')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Payment.countDocuments(query);

      return res.success(200, 'User payments retrieved successfully', {
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Get user payments error:', error);
      return res.error(500, 'Failed to get user payments');
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const payment = await Payment.findOne({ _id: id, user: userId })
        .populate('package', 'name price description');

      if (!payment) {
        return res.error(404, 'Payment not found');
      }

      return res.success(200, 'Payment retrieved successfully', { payment });

    } catch (error) {
      console.error('Get payment by ID error:', error);
      return res.error(500, 'Failed to get payment');
    }
  }

  /**
   * Generate payment widget HTML
   */
  async generatePaymentWidget(req, res) {
    try {
      const { checkoutId } = req.params;
      const { showApplePay = true, customStyle = '' } = req.query;

      if (!checkoutId) {
        return res.error(400, 'Checkout ID is required');
      }

      const widgetHtml = paymentService.generatePaymentWidget(checkoutId, {
        showApplePay: showApplePay === 'true',
        customStyle
      });

      res.setHeader('Content-Type', 'text/html');
      return res.send(widgetHtml);

    } catch (error) {
      console.error('Generate payment widget error:', error);
      return res.error(500, 'Failed to generate payment widget');
    }
  }

  /**
   * Get supported payment methods
   */
  async getSupportedPaymentMethods(req, res) {
    try {
      const methods = paymentService.getSupportedPaymentMethods();
      
      return res.success(200, 'Supported payment methods retrieved successfully', {
        methods
      });

    } catch (error) {
      console.error('Get payment methods error:', error);
      return res.error(500, 'Failed to get payment methods');
    }
  }
}

module.exports = new PaymentController(); 