const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate QR code image (base64) for a given string
async function generateQRCode(data, options = {}) {
  try {
    const defaultOptions = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };

    const qrOptions = { ...defaultOptions, ...options };
    
    return await QRCode.toDataURL(data, qrOptions);
  } catch (err) {
    throw new Error('Failed to generate QR code: ' + err.message);
  }
}

// Generate unique barcode for user packages
function generateUniqueBarcode(userId, packageId) {
  try {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    const barcode = `PAYPASS-${userId}-${packageId}-${timestamp}-${randomString}`;
    
    return barcode;
  } catch (err) {
    throw new Error('Failed to generate barcode: ' + err.message);
  }
}

// Generate simple numeric barcode
function generateNumericBarcode(length = 12) {
  try {
    let barcode = '';
    for (let i = 0; i < length; i++) {
      barcode += Math.floor(Math.random() * 10);
    }
    return barcode;
  } catch (err) {
    throw new Error('Failed to generate numeric barcode: ' + err.message);
  }
}

// Generate QR code for user package
async function generateUserPackageQR(userPackage) {
  try {
    const qrData = {
      type: 'user_package',
      barcode: userPackage.barcode,
      userId: userPackage.user,
      packageId: userPackage.package,
      washesLeft: userPackage.washesLeft,
      expiry: userPackage.expiry,
      status: userPackage.status
    };

    return await generateQRCode(JSON.stringify(qrData));
  } catch (err) {
    throw new Error('Failed to generate user package QR: ' + err.message);
  }
}

// Generate QR code for washing place
async function generateWashingPlaceQR(washingPlace) {
  try {
    const qrData = {
      type: 'washing_place',
      placeId: washingPlace._id,
      name: washingPlace.name,
      location: washingPlace.location,
      phone: washingPlace.phone
    };

    return await generateQRCode(JSON.stringify(qrData));
  } catch (err) {
    throw new Error('Failed to generate washing place QR: ' + err.message);
  }
}

// Validate barcode format
function validateBarcode(barcode) {
  try {
    // Check if barcode follows PAYPASS format
    if (barcode.startsWith('PAYPASS-')) {
      const parts = barcode.split('-');
      return parts.length >= 4;
    }
    
    // Check if it's a numeric barcode
    if (/^\d+$/.test(barcode)) {
      return barcode.length >= 8 && barcode.length <= 16;
    }
    
    return false;
  } catch (err) {
    return false;
  }
}

// Extract information from barcode
function extractBarcodeInfo(barcode) {
  try {
    if (barcode.startsWith('PAYPASS-')) {
      const parts = barcode.split('-');
      return {
        type: 'paypass',
        userId: parts[1],
        packageId: parts[2],
        timestamp: parts[3],
        random: parts[4]
      };
    }
    
    if (/^\d+$/.test(barcode)) {
      return {
        type: 'numeric',
        value: barcode,
        length: barcode.length
      };
    }
    
    return {
      type: 'unknown',
      value: barcode
    };
  } catch (err) {
    return {
      type: 'error',
      error: err.message
    };
  }
}

// Generate QR code with custom styling
async function generateStyledQRCode(data, style = {}) {
  try {
    const defaultStyle = {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a365d',  // Dark blue
        light: '#f7fafc'  // Light gray
      },
      errorCorrectionLevel: 'H'  // High error correction
    };

    const qrStyle = { ...defaultStyle, ...style };
    
    return await generateQRCode(data, qrStyle);
  } catch (err) {
    throw new Error('Failed to generate styled QR code: ' + err.message);
  }
}

// Generate QR code for payment
async function generatePaymentQR(payment) {
  try {
    const qrData = {
      type: 'payment',
      paymentId: payment._id,
      amount: payment.amount,
      currency: 'SAR',
      status: payment.status,
      timestamp: payment.createdAt
    };

    return await generateQRCode(JSON.stringify(qrData));
  } catch (err) {
    throw new Error('Failed to generate payment QR: ' + err.message);
  }
}

module.exports = {
  generateQRCode,
  generateUniqueBarcode,
  generateNumericBarcode,
  generateUserPackageQR,
  generateWashingPlaceQR,
  validateBarcode,
  extractBarcodeInfo,
  generateStyledQRCode,
  generatePaymentQR
}; 