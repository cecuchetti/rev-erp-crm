import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';

import useLanguage from '@/locale/useLanguage';
import { formatCurrency } from '@/utils/formatCurrency';
import { Tag, Badge } from 'antd';

export default function Products() {
  const translate = useLanguage();
  const entity = 'product';

  const searchConfig = {
    displayLabels: ['name', 'sku'],
    searchFields: 'name,sku,category,description',
  };
  
  const deleteModalLabels = ['name', 'sku'];
  
  const dataTableColumns = [
    {
      title: translate('SKU'),
      dataIndex: 'sku',
    },
    {
      title: translate('Name'),
      dataIndex: 'name',
    },
    {
      title: translate('Category'),
      dataIndex: 'category',
    },
    {
      title: translate('Price'),
      dataIndex: 'price',
      render: (price) => (
        <span style={{ fontWeight: '500' }}>
          {formatCurrency(price)}
        </span>
      ),
    },
    {
      title: translate('Cost'),
      dataIndex: 'cost',
      render: (cost) => (
        <span style={{ color: '#666' }}>
          {formatCurrency(cost)}
        </span>
      ),
    },
    {
      title: translate('Stock'),
      dataIndex: 'stock',
      render: (stock, record) => {
        const isLowStock = stock < record.lowStockThreshold;
        const isOutOfStock = stock === 0;
        
        return (
          <span 
            style={{ 
              fontWeight: '500',
              color: isOutOfStock ? '#F44336' : isLowStock ? '#FFA000' : '#333',
              padding: '2px 8px',
              borderRadius: '12px',
              backgroundColor: isOutOfStock ? 'rgba(244, 67, 54, 0.1)' : isLowStock ? 'rgba(255, 160, 0, 0.1)' : 'transparent'
            }}
          >
            {stock}
          </span>
        );
      },
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span 
              style={{ 
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: status === 'active' ? '#4CAF50' : status === 'inactive' ? '#FFA000' : '#F44336',
                marginRight: '8px'
              }}
            />
            <span>{status}</span>
          </div>
        );
      },
    },
    {
      title: translate('Featured'),
      dataIndex: 'featured',
      render: (featured) => (featured ? <Tag color="blue">{translate('Featured')}</Tag> : null),
    },
  ];

  const Labels = {
    PANEL_TITLE: translate('product'),
    DATATABLE_TITLE: translate('product_list'),
    ADD_NEW_ENTITY: translate('add_new_product'),
    ENTITY_NAME: translate('product'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} columns={2} />}
      updateForm={<DynamicForm fields={fields} columns={2} />}
      config={config}
    />
  );
} 