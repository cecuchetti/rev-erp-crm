import { Button, Dropdown } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function UpgradeButton() {
  const { translate } = useLanguage();

  const items = [
    {
      key: 'new_customer',
      label: translate('add_new_client'),
    },
    {
      key: 'new_invoice',
      label: translate('add_new_invoice'),
    },
    {
      key: 'new_product',
      label: translate('add_new_product'),
    },
    {
      key: 'new_quote',
      label: translate('add_new_quote'),
    },
  ];

  return (
    <Dropdown
      menu={{
        items,
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        style={{ 
          background: '#2d1e4f',
          borderColor: '#2d1e4f',
          borderRadius: '6px',
        }}
      >
        {translate('Create New')}
      </Button>
    </Dropdown>
  );
}
