import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Switch, Space, Divider, Card, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '@/request/request';
import useLanguage from '@/locale/useLanguage';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

const { TextArea } = Input;
const { Option } = Select;

/**
 * Generates a random SKU for a product
 * Format: REV-PRD-XXXXX where X is alphanumeric
 * @returns {string} Generated SKU
 */
const generateRandomSku = () => {
  const prefix = 'REV-PRD-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate 5 random characters
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return prefix + result;
};

export default function ProductsCreate() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const translate = useLanguage();
  const dispatch = useDispatch();

  // Generate a random SKU when the component mounts
  useEffect(() => {
    const sku = generateRandomSku();
    form.setFieldsValue({ sku });
  }, [form]);

  const onFinish = async (values) => {
    try {
      // Create the product
      const result = await request.create({ entity: 'product', jsonData: values });
      
      if (result && result._id) {
        message.success('Product created successfully!');
        
        // Refresh the product list to include the new product
        await dispatch(erp.list({ entity: 'product' }));
        
        // Navigate back to the product list
        navigate('/products');
      } else {
        message.error(result?.message || 'Error creating product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      message.error('An unexpected error occurred while creating the product');
    }
  };

  const onCancel = () => {
    navigate('/products');
  };

  const generateNewSku = () => {
    const sku = generateRandomSku();
    form.setFieldsValue({ sku });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Card 
        title="Add New Product"
        bordered={false}
        extra={
          <Button type="default" onClick={onCancel}>
            Cancel
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter the product name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="SKU"
                name="sku"
                tooltip="Stock Keeping Unit - Unique identifier for the product"
              >
                <Input 
                  addonAfter={
                    <Button 
                      type="link" 
                      size="small" 
                      onClick={generateNewSku}
                      style={{ marginRight: -7, marginLeft: -7 }}
                    >
                      Regenerate
                    </Button>
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Category"
                name="category"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                initialValue="active"
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="discontinued">Discontinued</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Pricing & Inventory</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: 'Please enter the price' }]}
              >
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Cost"
                name="cost"
                tooltip="Purchase cost of the product"
                initialValue={0}
              >
                <InputNumber min={0} precision={2} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tax (%)"
                name="tax"
                initialValue={0}
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Stock Quantity"
                name="stock"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Low Stock Threshold"
                name="lowStockThreshold"
                initialValue={5}
                tooltip="Alert when stock falls below this level"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Discountable"
                name="discountable"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Details</Divider>

          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tags"
                name="tags"
                tooltip="Enter tags separated by commas"
              >
                <Select mode="tags" style={{ width: '100%' }} placeholder="Tags" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Featured Product"
                name="featured"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Button type="default" onClick={onCancel} block>
                  Cancel
                </Button>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType="submit" block>
                  Create Product
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 