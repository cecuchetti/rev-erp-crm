const mongoose = require('mongoose');

const Model = mongoose.model('Product');

const remove = async (req, res) => {
  try {
    // Find the document by id
    const product = await Model.findOne({ _id: req.params.id });
    
    // If no results found, return document not found
    if (!product) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No product found by this id: ' + req.params.id,
      });
    }
    
    // Instead of deleting the document, we set 'removed' to true
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      { removed: true, updated: new Date() },
      {
        new: true, // return the new result instead of the old one
      }
    ).exec();
    
    return res.status(200).json({
      success: true,
      result,
      message: 'Product deleted successfully',
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

module.exports = remove; 