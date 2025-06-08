const mongoose = require('mongoose');

const Model = mongoose.model('Product');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  try {
    let body = req.body;

    const { error, value } = schema.validate(body);
    if (error) {
      const { details } = error;
      return res.status(400).json({
        success: false,
        result: null,
        message: details[0]?.message,
      });
    }

    // If SKU is provided, check if it's unique
    if (body.sku) {
      const existingSku = await Model.findOne({ sku: body.sku, removed: false });
      if (existingSku) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `A product with SKU "${body.sku}" already exists`,
        });
      }
    }

    // Add createdBy field with current admin ID
    body['createdBy'] = req.admin._id;
    
    // Set creation and update timestamps
    const now = new Date();
    body['created'] = now;
    body['updated'] = now;

    // Creating a new document in the collection
    const result = await new Model(body).save();

    // Returning successful response
    return res.status(200).json({
      success: true,
      result,
      message: 'Product created successfully',
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

module.exports = create; 