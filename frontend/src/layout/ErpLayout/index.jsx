import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';
import { useSelector } from 'react-redux';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="shadow"
        style={{
          margin: '0 auto',
          width: '100%',
          maxWidth: '1100px',
          minHeight: '600px',
          background: '#fff',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
