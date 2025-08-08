const express = require('express');
const router = express.Router();
const referralController = require('../../controllers/referral.controller');
const auth = require('../../middleware/auth');

// Get all referrals for current user
router.get('/', auth, referralController.getReferrals);

// Get specific referral by ID
router.get('/:id', auth, referralController.getReferral);

// Create new referral
router.post('/', auth, referralController.createReferral);

// Accept referral
router.post('/:id/accept', auth, referralController.acceptReferral);

// Reward referral
router.post('/:id/reward', auth, referralController.rewardReferral);

// Delete referral
router.delete('/:id', auth, referralController.deleteReferral);

module.exports = router; 