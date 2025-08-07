const Referral = require('./referral.model');
const User = require('./user.model');

// Get all referrals for current user
exports.getReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ 
      $or: [
        { referrer: req.user.userId },
        { referred: req.user.userId }
      ]
    })
    .populate('referrer', 'name email')
    .populate('referred', 'name email')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: referrals
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific referral by ID
exports.getReferral = async (req, res) => {
  try {
    const referral = await Referral.findOne({
      _id: req.params.id,
      $or: [
        { referrer: req.user.userId },
        { referred: req.user.userId }
      ]
    })
    .populate('referrer', 'name email')
    .populate('referred', 'name email');
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    
    res.json({
      success: true,
      data: referral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new referral
exports.createReferral = async (req, res) => {
  try {
    const { referredEmail, referredPhone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: referredEmail },
        { phone: referredPhone }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Check if referral already exists
    const existingReferral = await Referral.findOne({
      referrer: req.user.userId,
      $or: [
        { referredEmail },
        { referredPhone }
      ]
    });
    
    if (existingReferral) {
      return res.status(400).json({ error: 'Referral already exists' });
    }
    
    const referral = new Referral({
      referrer: req.user.userId,
      referredEmail,
      referredPhone,
      status: 'pending'
    });
    
    await referral.save();
    
    res.status(201).json({
      success: true,
      data: referral
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Accept referral
exports.acceptReferral = async (req, res) => {
  try {
    const referral = await Referral.findOneAndUpdate(
      { _id: req.params.id, status: 'pending' },
      { 
        status: 'accepted',
        acceptedAt: new Date()
      },
      { new: true }
    );
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found or already processed' });
    }
    
    res.json({
      success: true,
      data: referral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reward referral
exports.rewardReferral = async (req, res) => {
  try {
    const referral = await Referral.findOneAndUpdate(
      { _id: req.params.id, status: 'accepted' },
      { 
        status: 'rewarded',
        rewardedAt: new Date()
      },
      { new: true }
    );
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found or not accepted' });
    }
    
    res.json({
      success: true,
      data: referral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete referral
exports.deleteReferral = async (req, res) => {
  try {
    const referral = await Referral.findOneAndDelete({
      _id: req.params.id,
      referrer: req.user.userId
    });
    
    if (!referral) {
      return res.status(404).json({ error: 'Referral not found' });
    }
    
    res.json({
      success: true,
      message: 'Referral deleted successfully'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 