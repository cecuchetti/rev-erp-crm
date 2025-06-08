const mongoose = require('mongoose');

const Model = mongoose.model('Product');

const read = async (req, res) => {
  // Find document by id
  const result = await Model.findOne({ 
    _id: req.params.id,
    removed: false 
  });
  
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No product found by this id: ' + req.params.id,
    });
  }
  
  // Return success response
  return res.status(200).json({
    success: true,
    result,
    message: 'Product found successfully',
  });
};

module.exports = read; 