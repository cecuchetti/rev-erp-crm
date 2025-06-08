const mongoose = require('mongoose');

const Model = mongoose.model('Product');

const summary = async (req, res) => {
  try {
    // Total count of products (excluding removed ones)
    const totalCount = await Model.countDocuments({ removed: false });

    // Products with low stock (less than their lowStockThreshold)
    const lowStockProducts = await Model.aggregate([
      {
        $match: {
          removed: false,
          $expr: { $lt: ["$stock", "$lowStockThreshold"] }
        }
      },
      { $count: "count" }
    ]);
    const lowStockCount = lowStockProducts.length > 0 ? lowStockProducts[0].count : 0;

    // Total value of inventory (sum of price * stock for all products)
    const inventoryValue = await Model.aggregate([
      {
        $match: { removed: false }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$price', '$stock'] } },
          cost: { $sum: { $multiply: ['$cost', '$stock'] } }
        }
      }
    ]);

    // Calculate potential profit
    const potentialProfit = inventoryValue.length > 0 
      ? inventoryValue[0].total - inventoryValue[0].cost 
      : 0;

    // Products by category
    const productsByCategory = await Model.aggregate([
      {
        $match: { removed: false }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$stock'] } }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          totalValue: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Products by status
    const productsByStatus = await Model.aggregate([
      {
        $match: { removed: false }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // Top 5 most expensive products
    const topExpensiveProducts = await Model.find({ removed: false })
      .sort({ price: -1 })
      .limit(5)
      .select('name price stock sku');

    // Top 5 products with highest stock
    const topStockedProducts = await Model.find({ removed: false })
      .sort({ stock: -1 })
      .limit(5)
      .select('name price stock sku');

    // Products with zero stock
    const outOfStockCount = await Model.countDocuments({ removed: false, stock: 0 });

    // Featured products count
    const featuredCount = await Model.countDocuments({ removed: false, featured: true });

    return res.status(200).json({
      success: true,
      result: {
        totalCount,
        lowStockCount,
        outOfStockCount,
        featuredCount,
        inventoryValue: inventoryValue.length > 0 ? inventoryValue[0].total : 0,
        inventoryCost: inventoryValue.length > 0 ? inventoryValue[0].cost : 0,
        potentialProfit,
        productsByCategory,
        productsByStatus,
        topExpensiveProducts,
        topStockedProducts
      },
      message: 'Product summary fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = summary; 