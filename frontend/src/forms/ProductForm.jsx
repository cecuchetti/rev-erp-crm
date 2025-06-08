import { Form, Input, InputNumber, Select, Switch } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { TextArea } = Input;
const { Option } = Select;

export default function ProductForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  
  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form.Item
        label={translate('Name')}
        name="name"
        rules={[
          {
            required: true,
            message: 'Please enter the product name',
          },
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('SKU')}
        name="sku"
        tooltip="Stock Keeping Unit - Unique identifier for the product"
        rules={[
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Category')}
        name="category"
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Status')}
        name="status"
        initialValue="active"
      >
        <Select>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="discontinued">Discontinued</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label={translate('Price')}
        name="price"
        rules={[
          {
            required: true,
            message: 'Please enter the price',
          },
        ]}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={translate('Cost')}
        name="cost"
        tooltip="Purchase cost of the product"
        initialValue={0}
      >
        <InputNumber min={0} precision={2} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={translate('Stock')}
        name="stock"
        initialValue={0}
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={translate('Low Stock Threshold')}
        name="lowStockThreshold"
        initialValue={5}
        tooltip="Alert when stock falls below this level"
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label={translate('Description')}
        name="description"
      >
        <TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label={translate('Featured')}
        name="featured"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label={translate('Discountable')}
        name="discountable"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch />
      </Form.Item>

      <Form.Item
        label={translate('Tax (%)')}
        name="tax"
        initialValue={0}
      >
        <InputNumber min={0} max={100} style={{ width: '100%' }} />
      </Form.Item>
    </>
  );
} 