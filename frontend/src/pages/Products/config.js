export const fields = {
  // Left column fields (mostly required/important fields)
  name: {
    type: 'string',
    required: true,
  },
  sku: {
    type: 'string',
  },
  price: {
    type: 'number',
    required: true,
  },
  cost: {
    type: 'number',
    initialValue: 0,
  },
  status: {
    type: 'selectWithTranslation',
    options: [
      {
        value: 'active',
        label: 'Active',
        color: 'green',
      },
      {
        value: 'inactive',
        label: 'Inactive',
        color: 'orange',
      },
      {
        value: 'discontinued',
        label: 'Discontinued',
        color: 'red',
      },
    ],
    initialValue: 'active',
  },
  featured: {
    type: 'boolean',
    initialValue: false,
  },
  
  // Right column fields (mostly optional/secondary fields)
  category: {
    type: 'string',
  },
  stock: {
    type: 'number',
    initialValue: 0,
  },
  lowStockThreshold: {
    type: 'number',
    initialValue: 5,
  },
  tax: {
    type: 'number',
    initialValue: 0,
  },
  discountable: {
    type: 'boolean',
    initialValue: true,
  },
  description: {
    type: 'textArea',
    rows: 4,
  },
}; 