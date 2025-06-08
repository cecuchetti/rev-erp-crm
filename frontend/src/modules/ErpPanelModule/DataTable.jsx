import { useEffect } from 'react';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  RedoOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Empty } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import { useSelector, useDispatch } from 'react-redux';
import useLanguage from '@/locale/useLanguage';
import { erp } from '@/redux/erp/actions';
import { selectListItems } from '@/redux/erp/selectors';
import { useErpContext } from '@/context/erp';
import { generate as uniqueId } from 'shortid';
import { useNavigate } from 'react-router-dom';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

function CustomEmptyState({ entity, onAddNew, isAddDisabled, onLoadData }) {
  const translate = useLanguage();
  
  return (
    <Empty
      image={<InboxOutlined style={{ fontSize: 60, color: '#2d1e4f' }} />}
      imageStyle={{ height: 80 }}
      description={
        <div>
          <h3 style={{ color: '#2d1e4f', fontWeight: 500, marginBottom: 16 }}>
            {translate('no_data_available')}
          </h3>
          <p style={{ color: '#666', marginBottom: 24 }}>
            {translate('there_are_no_entity_in_your_account_yet').replace('{entity}', entity)}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {onLoadData && (
              <Button
                onClick={onLoadData}
                style={{ borderRadius: '4px' }}
              >
                {translate('load_data')}
              </Button>
            )}
            {!isAddDisabled && (
              <Button 
                type="primary" 
                icon={<PlusCircleOutlined />} 
                onClick={onAddNew}
                style={{
                  backgroundColor: '#15a3a8', 
                  borderColor: '#15a3a8',
                  borderRadius: '4px'
                }}
              >
                {translate('add_your_first_entity').replace('{entity}', entity)}
              </Button>
            )}
          </div>
        </div>
      }
    />
  );
}

function AddNewItem({ config }) {
  const navigate = useNavigate();
  const { ADD_NEW_ENTITY, entity } = config;

  const handleClick = () => {
    if (entity === 'product') {
      navigate('/products/create');
    } else {
      navigate(`/${entity.toLowerCase()}/create`);
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      type="primary" 
      icon={<PlusOutlined />}
      style={{
        backgroundColor: '#15a3a8', 
        borderColor: '#15a3a8',
        borderRadius: '4px'
      }}
    >
      {ADD_NEW_ENTITY}
    </Button>
  );
}

export default function DataTable({ config, extra = [] }) {
  const translate = useLanguage();
  let { entity, dataTableColumns, disableAdd = false, searchConfig } = config;

  const { DATATABLE_TITLE } = config;

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;
  const hasNoData = !dataSource || dataSource.length === 0;

  const { erpContextAction } = useErpContext();
  const { modal } = erpContextAction;

  const items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },
    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];

  const navigate = useNavigate();

  const handleRead = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/${entity}/read/${record._id}`);
  };
  const handleEdit = (record) => {
    const data = { ...record };
    dispatch(erp.currentAction({ actionType: 'update', data }));
    navigate(`/${entity}/update/${record._id}`);
  };
  const handleDownload = (record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  const handleDelete = (record) => {
    dispatch(erp.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  };

  const handleRecordPayment = (record) => {
    dispatch(erp.currentItem({ data: record }));
    navigate(`/invoice/pay/${record._id}`);
  };

  const handleAddNew = () => {
    if (entity === 'product') {
      navigate('/products/create');
    } else {
      navigate(`/${entity.toLowerCase()}/create`);
    }
  };

  dataTableColumns = [
    ...dataTableColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;
                case 'delete':
                  handleDelete(record);
                  break;
                case 'recordPayment':
                  handleRecordPayment(record);
                  break;
                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const dispatch = useDispatch();

  const handelDataTableLoad = (pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(erp.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(erp.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, [entity]);

  const filterTable = (value) => {
    const options = { equal: value, filter: searchConfig?.entity };
    dispatch(erp.list({ entity, options }));
  };

  return (
    <>
      <PageHeader
        title={DATATABLE_TITLE}
        ghost={true}
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        extra={[
          <AutoCompleteAsync
            key="autocomplete"
            entity={searchConfig?.entity}
            displayLabels={['name']}
            searchFields={'name'}
            onChange={filterTable}
            style={{
              width: 250,
              marginRight: 10,
              borderRadius: '4px'
            }}
          />, 
          <Button 
            onClick={handelDataTableLoad} 
            key="refresh" 
            icon={<RedoOutlined />}
            style={{
              borderRadius: '4px'
            }}
          >
            {translate('Refresh')}
          </Button>,
          !disableAdd && <AddNewItem config={config} key="add" />,
        ]}
        style={{
          padding: '20px 0px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      ></PageHeader>
      
      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        padding: hasNoData ? '40px 20px' : 0
      }}>
        {hasNoData && !listIsLoading ? (
          <CustomEmptyState entity={entity} onAddNew={handleAddNew} isAddDisabled={disableAdd} onLoadData={dispatcher} />
        ) : (
          <Table
            columns={dataTableColumns}
            rowKey={(item) => item._id}
            dataSource={dataSource}
            pagination={pagination}
            loading={listIsLoading}
            onChange={handelDataTableLoad}
            scroll={{ x: true }}
            locale={{
              emptyText: <CustomEmptyState entity={entity} onAddNew={handleAddNew} isAddDisabled={disableAdd} onLoadData={dispatcher} />
            }}
          />
        )}
      </div>
    </>
  );
}