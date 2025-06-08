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
      render: (price) => formatCurrency(price),
    },
    {
      title: translate('Cost'),
      dataIndex: 'cost',
      render: (cost) => formatCurrency(cost),
    },
    {
      title: translate('Stock'),
      dataIndex: 'stock',
      render: (stock, record) => {
        const isLowStock = stock < record.lowStockThreshold;
        return (
          <span style={{ color: isLowStock && stock > 0 ? 'orange' : stock === 0 ? 'red' : 'inherit' }}>
            {stock}
          </span>
        );
      },
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'inactive') color = 'orange';
        if (status === 'discontinued') color = 'red';
        return (
          <Badge
            status={status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'error'}
            text={status}
          />
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