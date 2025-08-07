const express = require("express");
const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ 
    message: "PayPass API is working! 🚀",
    status: "success",
    timestamp: new Date().toISOString()
  });
});

// Health check route
router.get("/health", (req, res) => {
  res.json({ 
    status: "healthy",
    server: "running",
    database: "connected",
    timestamp: new Date().toISOString()
  });
});

// Simple API routes for testing
router.get("/", (req, res) => {
  res.json({
    message: "PayPass API Root",
    availableEndpoints: [
      "/test",
      "/health",
      "/api",
      "/api/test",
      "/api/health",
      "/qr/generate",
      "/qr/scan",
      "/qr/validate",
      "/qr/status/:orderId",
      "/qr/use"
    ]
  });
});

// QR Code routes
router.post("/qr/generate", (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Data is required" });
    }
    
    // Generate QR code
    const qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      message: "QR code generated successfully",
      data: {
        qrCode,
        originalData: data,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/qr/scan", (req, res) => {
  try {
    const { qrData } = req.body;
    if (!qrData) {
      return res.status(400).json({ error: "QR data is required" });
    }
    
    res.json({
      success: true,
      message: "QR code scanned successfully",
      data: {
        scannedData: qrData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/qr/validate", (req, res) => {
  try {
    const { qrCode } = req.body;
    if (!qrCode) {
      return res.status(400).json({ error: "QR code is required" });
    }
    
    // Validate QR code
    const isValid = qrCode.startsWith('QR_');
    
    res.json({
      success: true,
      message: isValid ? "QR code is valid" : "QR code is invalid",
      data: {
        isValid,
        qrCode,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/qr/status/:orderId", (req, res) => {
  try {
    const { orderId } = req.params;
    
    res.json({
      success: true,
      message: "QR status retrieved successfully",
      data: {
        orderId,
        status: "active",
        qrCode: `QR_${orderId}_${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/qr/use", (req, res) => {
  try {
    const { operationId, branchId } = req.body;
    if (!operationId || !branchId) {
      return res.status(400).json({ error: "Operation ID and Branch ID are required" });
    }
    
    res.json({
      success: true,
      message: "QR code used successfully",
      data: {
        operationId,
        branchId,
        status: "completed",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard Routes
router.get("/dashboard/stats", (req, res) => {
  try {
    // Mock data for dashboard stats
    const stats = {
      totalUsers: 1250,
      totalOrders: 3456,
      totalRevenue: 125000,
      activeOrders: 45,
      totalBranches: 8,
      totalPackages: 12,
      averageRating: 4.5,
      todayOrders: 23
    };
    
    res.json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/recent-orders", (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Mock recent orders data
    const recentOrders = Array.from({ length: limit }, (_, i) => ({
      _id: `order_${i + 1}`,
      orderNumber: `ORD${String(i + 1).padStart(4, '0')}`,
      customerName: `عميل ${i + 1}`,
      customerPhone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      customerAvatar: `https://via.placeholder.com/40`,
      branchName: `فرع ${Math.floor(Math.random() * 5) + 1}`,
      packageName: `باقة ${Math.floor(Math.random() * 3) + 1}`,
      totalAmount: Math.floor(Math.random() * 200) + 50,
      status: ['pending', 'in_progress', 'completed', 'ready_for_pickup'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Recent orders retrieved successfully",
      data: { orders: recentOrders }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/live-tracking", (req, res) => {
  try {
    // Mock live tracking data
    const liveOrders = Array.from({ length: 8 }, (_, i) => ({
      _id: `live_order_${i + 1}`,
      orderNumber: `LIVE${String(i + 1).padStart(4, '0')}`,
      customerName: `عميل مباشر ${i + 1}`,
      customerPhone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      branchName: `فرع ${Math.floor(Math.random() * 5) + 1}`,
      packageName: `باقة ${Math.floor(Math.random() * 3) + 1}`,
      totalAmount: Math.floor(Math.random() * 200) + 50,
      status: ['pending', 'in_progress', 'ready_for_pickup'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Live tracking data retrieved successfully",
      data: { orders: liveOrders }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/branch-performance", (req, res) => {
  try {
    // Mock branch performance data
    const branchPerformance = [
      {
        branchId: "branch_1",
        branchName: "الفرع الرئيسي",
        city: "الرياض",
        totalOrders: 150,
        completedOrders: 145,
        revenue: 25000,
        growth: 12.5
      },
      {
        branchId: "branch_2",
        branchName: "فرع جدة",
        city: "جدة",
        totalOrders: 120,
        completedOrders: 118,
        revenue: 20000,
        growth: 8.3
      },
      {
        branchId: "branch_3",
        branchName: "فرع الدمام",
        city: "الدمام",
        totalOrders: 95,
        completedOrders: 92,
        revenue: 16000,
        growth: 15.2
      }
    ];
    
    res.json({
      success: true,
      message: "Branch performance data retrieved successfully",
      data: { branches: branchPerformance }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/dashboard/revenue", (req, res) => {
  try {
    const period = req.query.period || 'month';
    
    // Mock revenue analytics data
    const revenueData = {
      daily: {
        labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        data: [1200, 1500, 1800, 1600, 2000, 2200, 1900]
      },
      weekly: {
        labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
        data: [8500, 9200, 8800, 9500]
      },
      monthly: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        data: [35000, 38000, 42000, 45000, 48000, 52000]
      }
    };
    
    res.json({
      success: true,
      message: "Revenue analytics retrieved successfully",
      data: revenueData[period] || revenueData.monthly
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mock data for other API endpoints
router.get("/users", (req, res) => {
  try {
    const users = Array.from({ length: 20 }, (_, i) => ({
      _id: `user_${i + 1}`,
      name: `مستخدم ${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      role: ['customer', 'employee', 'admin'][Math.floor(Math.random() * 3)],
      status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: { users }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/washing-places", (req, res) => {
  try {
    const branches = Array.from({ length: 8 }, (_, i) => ({
      _id: `branch_${i + 1}`,
      name: `فرع ${i + 1}`,
      city: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'][Math.floor(Math.random() * 5)],
      address: `عنوان الفرع ${i + 1}`,
      phone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      status: 'active',
      activeOrders: Math.floor(Math.random() * 20) + 5
    }));
    
    res.json({
      success: true,
      message: "Branches retrieved successfully",
      data: { branches }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/packages", (req, res) => {
  try {
    const packages = Array.from({ length: 12 }, (_, i) => ({
      _id: `package_${i + 1}`,
      name: `باقة ${i + 1}`,
      description: `وصف الباقة ${i + 1}`,
      price: Math.floor(Math.random() * 200) + 50,
      duration: Math.floor(Math.random() * 120) + 30,
      status: 'active'
    }));
    
    res.json({
      success: true,
      message: "Packages retrieved successfully",
      data: { packages }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/washes", (req, res) => {
  try {
    const orders = Array.from({ length: 50 }, (_, i) => ({
      _id: `order_${i + 1}`,
      orderNumber: `ORD${String(i + 1).padStart(4, '0')}`,
      customerName: `عميل ${i + 1}`,
      customerPhone: `+9665${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      customerAvatar: `https://via.placeholder.com/40`,
      branchName: `فرع ${Math.floor(Math.random() * 5) + 1}`,
      packageName: `باقة ${Math.floor(Math.random() * 3) + 1}`,
      totalAmount: Math.floor(Math.random() * 200) + 50,
      status: ['pending', 'in_progress', 'completed', 'cancelled', 'ready_for_pickup'][Math.floor(Math.random() * 5)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Orders retrieved successfully",
      data: { orders }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/payments", (req, res) => {
  try {
    const payments = Array.from({ length: 100 }, (_, i) => ({
      _id: `payment_${i + 1}`,
      orderId: `order_${i + 1}`,
      amount: Math.floor(Math.random() * 200) + 50,
      method: ['cash', 'card', 'online'][Math.floor(Math.random() * 3)],
      status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Payments retrieved successfully",
      data: { payments }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/feedbacks", (req, res) => {
  try {
    const feedbacks = Array.from({ length: 80 }, (_, i) => ({
      _id: `feedback_${i + 1}`,
      orderId: `order_${i + 1}`,
      customerName: `عميل ${i + 1}`,
      rating: Math.floor(Math.random() * 5) + 1,
      comment: `تعليق العميل ${i + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
    
    res.json({
      success: true,
      message: "Feedbacks retrieved successfully",
      data: { feedbacks }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use("/user", require("../modules/user/user.routes"))
module.exports = router;
