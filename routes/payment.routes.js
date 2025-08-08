const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const auth = require('../../middleware/auth');

// Apply authentication middleware to all routes
router.use(auth);

/**
 * @route   POST /api/payments/prepare-checkout
 * @desc    Prepare payment checkout session
 * @access  Private
 */
router.post('/prepare-checkout', paymentController.prepareCheckout);

/**
 * @route   GET /api/payments/status/:checkoutId
 * @desc    Get payment status
 * @access  Private
 */
router.get('/status/:checkoutId', paymentController.getPaymentStatus);

/**
 * @route   POST /api/payments/process-result
 * @desc    Process payment result (webhook)
 * @access  Public (webhook)
 */
router.post('/process-result', paymentController.processPaymentResult);

/**
 * @route   GET /api/payments/config
 * @desc    Get payment configuration
 * @access  Private
 */
router.get('/config', paymentController.getPaymentConfig);

/**
 * @route   GET /api/payments/user
 * @desc    Get user payments
 * @access  Private
 */
router.get('/user', paymentController.getUserPayments);

/**
 * @route   GET /api/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get('/:id', paymentController.getPaymentById);

/**
 * @route   GET /api/payments/widget/:checkoutId
 * @desc    Generate payment widget HTML
 * @access  Private
 */
router.get('/widget/:checkoutId', paymentController.generatePaymentWidget);

/**
 * @route   GET /api/payments/methods
 * @desc    Get supported payment methods
 * @access  Private
 */
router.get('/methods', paymentController.getSupportedPaymentMethods);

module.exports = router;
