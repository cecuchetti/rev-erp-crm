const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  category: { 
    type: String,
    trim: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: { 
    type: Number, 
    default: 0,
    min: 0
  },
  description: { 
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [{ 
    type: String,
    trim: true 
  }],
  images: [{ 
    type: String 
  }],
  featured: {
    type: Boolean,
    default: false
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: 0
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client'
  },
  dimensions: {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
    weight: { type: Number },
    unit: { 
      type: String,
      enum: ['cm', 'in', 'mm'],
      default: 'cm'
    }
  },
  variants: [{
    name: { type: String },
    options: [{ type: String }]
  }],
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  discountable: {
    type: Boolean,
    default: true
  },
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: 'Admin',
    autopopulate: true
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

productSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Product', productSchema); 