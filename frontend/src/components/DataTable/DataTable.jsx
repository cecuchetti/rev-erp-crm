import { useCallback, useEffect } from 'react';

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  PlusCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { Dropdown, Table, Button, Input, Empty } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';

import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';

function CustomEmptyState({ entity, onAddNew, onLoadData }) {
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
          </div>
        </div>
      }
    />
  );
}

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button 
      onClick={handelClick} 
      type="primary"
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
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();

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

  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  const handleAddNew = () => {
    panel.open();
    collapsedBox.close();
  };

  let dispatchColumns = [];
  if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  } else {
    dispatchColumns = [...dataTableColumns];
  }

  dataTableColumns = [
    ...dispatchColumns,
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

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
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

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;
  const hasNoData = !dataSource || dataSource.length === 0;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
            style={{
              borderRadius: '4px'
            }}
          />,
          <Button 
            onClick={handelDataTableLoad} 
            key={`${uniqueId()}`} 
            icon={<RedoOutlined />}
            style={{
              borderRadius: '4px'
            }}
          >
            {translate('Refresh')}
          </Button>,

          <AddNewItem key={`${uniqueId()}`} config={config} />,
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
          <CustomEmptyState entity={entity} onAddNew={handleAddNew} onLoadData={dispatcher} />
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
              emptyText: <CustomEmptyState entity={entity} onAddNew={handleAddNew} onLoadData={dispatcher} />
            }}
          />
        )}
      </div>
    </>
  );
}
