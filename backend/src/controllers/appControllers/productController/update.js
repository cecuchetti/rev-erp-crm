const mongoose = require('mongoose');

const Model = mongoose.model('Product');
const schema = require('./schemaValidate');

const update = async (req, res) => {
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

    // If SKU is provided, check if it's unique (excluding current product)
    if (body.sku) {
      const existingSku = await Model.findOne({ 
        sku: body.sku, 
        _id: { $ne: req.params.id },
        removed: false 
      });
      
      if (existingSku) {
        return res.status(400).json({
          success: false,
          result: null,
          message: `A product with SKU "${body.sku}" already exists`,
        });
      }
    }

    // Update the 'updated' timestamp
    body['updated'] = new Date();

    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate(
      { 
        _id: req.params.id,
        removed: false
      },
      body,
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No product found by this id: ' + req.params.id,
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Product updated successfully',
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

module.exports = update; 