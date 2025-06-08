import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';

export default function ProductDataTableModule({ config }) {
  const dispatch = useDispatch();
  const { entity } = config;

  // Refresh the data when component mounts
  useEffect(() => {
    // Fetch the latest product data
    dispatch(erp.list({ entity }));
    
    // Set up refresh on return to this component (e.g., after creating a product)
    return () => {
      // This cleanup function runs when the component unmounts
      // We could add additional cleanup here if needed
    };
  }, [dispatch, entity]);

  return (
    <ErpLayout>
      <ErpPanel config={config} />
    </ErpLayout>
  );
} 