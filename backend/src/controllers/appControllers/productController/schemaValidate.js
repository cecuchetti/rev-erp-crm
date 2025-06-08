const Joi = require('joi');

// Schema for product validation
const schema = Joi.object({
  removed: Joi.boolean().default(false),
  name: Joi.string().required().trim(),
  sku: Joi.string().trim().allow('', null),
  category: Joi.string().trim().allow('', null),
  price: Joi.number().min(0).required(),
  cost: Joi.number().min(0).default(0),
  stock: Joi.number().min(0).default(0),
  description: Joi.string().trim().allow('', null),
  status: Joi.string().valid('active', 'inactive', 'discontinued').default('active'),
  tags: Joi.array().items(Joi.string().trim()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  featured: Joi.boolean().default(false),
  lowStockThreshold: Joi.number().min(0).default(5),
  supplier: Joi.string().allow('', null),
  dimensions: Joi.object({
    width: Joi.number().allow(null),
    height: Joi.number().allow(null),
    depth: Joi.number().allow(null),
    weight: Joi.number().allow(null),
    unit: Joi.string().valid('cm', 'in', 'mm').default('cm')
  }).allow(null),
  variants: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      options: Joi.array().items(Joi.string())
    })
  ).default([]),
  tax: Joi.number().min(0).default(0),
  discountable: Joi.boolean().default(true),
  createdBy: Joi.string().optional(),
  updated: Joi.date().default(Date.now),
  created: Joi.date().default(Date.now)
});

module.exports = schema; 