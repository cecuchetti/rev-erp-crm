import { useDispatch, useSelector } from 'react-redux';
import { Input, Form, Select, Switch, Tooltip, Typography } from 'antd';
import { CloseOutlined, CheckOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState, useRef } from 'react';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';
import * as actionTypes from '@/redux/settings/types';
import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import storePersist from '@/redux/storePersist';

import useLanguage from '@/locale/useLanguage';

const { Text } = Typography;

// Helper function to make direct API calls
const makeDirectApiCall = async (endpoint, data) => {
  try {
    // Include auth token
    const auth = storePersist.get('auth');
    const headers = {};
    
    if (auth) {
      headers['Authorization'] = `Bearer ${auth.current.token}`;
    }
    
    // Make the API call
    const response = await axios.patch(
      `${API_BASE_URL}/${endpoint}`, 
      data,
      { 
        headers,
        withCredentials: true
      }
    );
    
    return response.data;
  } catch (error) {
    console.error("[ERROR] API call failed:", error);
    throw error;
  }
};

export default function GeneralSettingForm() {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { result } = useSelector(selectSettings);
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'en_us');
  const [form] = Form.useForm();
  
  // Debug current settings and sync form with localStorage
  useEffect(() => {
    if (result && result.app_settings) {
      
      // Always get the most current language from localStorage
      const localLang = localStorage.getItem('language');
      
      if (localLang) {
        setCurrentLanguage(localLang);
        
        // Update form values except language (which we'll handle separately)
        try {
          form.setFieldsValue({
            idurar_app_date_format: result.app_settings.idurar_app_date_format,
            idurar_app_company_email: result.app_settings.idurar_app_company_email,
          });
        } catch (error) {
          console.error("[ERROR] Failed to update form field:", error);
        }
      }
    }
  }, [result, form]);

  const handleLanguageChange = async (value) => {
    try {
      
      // Update state immediately
      setCurrentLanguage(value);
      
      // 1. Update localStorage immediately
      localStorage.setItem('language', value);
      
      // 2. Make a direct API call to update the setting in the database
      const settings = [
        { settingKey: 'idurar_app_language', settingValue: value }
      ];
            
      // Use direct API call to ensure it reaches the backend
      const updateResponse = await makeDirectApiCall(
        'setting/updateManySetting', 
        { settings }
      );
            
      if (updateResponse.success) {        
        // 3. Update Redux store
        dispatch(settingsAction.list({ entity: 'setting' }));
        
        // 4. For Spanish, use special approach
        if (value === 'es_es') {
          setTimeout(() => {
            window.location.href = window.location.href.split('?')[0] + '?forceSpanish=true';
          }, 500);
        } else {
          setTimeout(() => {
            window.location.href = window.location.href.split('?')[0] + '?lang=' + value;
          }, 500);
        }
      } else {
        console.error("[ERROR] Failed to update language in backend:", updateResponse.message);
        // Fall back to the Redux approach
        const reduxSettings = [
          { settingKey: 'idurar_app_language', settingValue: value }
        ];
        
        dispatch(settingsAction.updateMany({ 
          entity: 'setting', 
          jsonData: { settings: reduxSettings } 
        }));
        
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error("[ERROR] Language change failed:", error);
      
      // Even if it fails, reload to apply the localStorage change
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div>
      <Form form={form}>
        <Form.Item
          label={translate('Date Format')}
          name="idurar_app_date_format"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            showSearch
            style={{
              width: '100%',
            }}
            options={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
              { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
              { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
              { value: 'YYYY-DD-MM', label: 'YYYY-DD-MM' },
              { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
              { value: 'MM/YYYY/DD', label: 'MM/YYYY/DD' },
              { value: 'MM.DD.YYYY', label: 'MM.DD.YYYY' },
              { value: 'DD/YYYY/MM', label: 'DD/YYYY/MM' },
              { value: 'DD-YYYY-MM', label: 'DD-YYYY-MM' },
              { value: 'DD.YYYY.MM', label: 'DD.YYYY.MM' },
              { value: 'YYYY/DD/MM', label: 'YYYY/DD/MM' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              { value: 'MM.DD.YY', label: 'MM.DD.YY' },
              { value: 'DD-MMM-YY', label: 'DD-MMM-YY' },
              { value: 'YY/MM/DD', label: 'YY/MM/DD' },
              { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
              { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' },
              { value: 'DD-MM-YY', label: 'DD-MM-YY' },
              { value: 'MM-DD-YY', label: 'MM-DD-YY' },
              { value: 'YY.MM.DD', label: 'YY.MM.DD' },
              { value: 'MMM DD YY', label: 'MMM DD YY' },
              { value: 'DD MMM YY', label: 'DD MMM YY' },
              { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
              { value: 'MM.YYYY.DD', label: 'MM.YYYY.DD' },
              { value: 'YYYY/DD/MM', label: 'YYYY/DD/MM' },
              { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
              { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
              { value: 'YY/DD/MM', label: 'YY/DD/MM' },
              { value: 'MM-DD', label: 'MM-DD' },
              { value: 'DD-MM', label: 'DD-MM' },
              { value: 'MM/YY', label: 'MM/YY' },
              { value: 'YYYY-MMM-DD', label: 'YYYY-MMM-DD' },
              { value: 'MM/DD', label: 'MM/DD' },
              { value: 'DD.MM.YY', label: 'DD.MM.YY' },
              { value: 'MM/YY/DD', label: 'MM/YY/DD' },
              { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY' },
              { value: 'DD MMMM YYYY', label: 'DD MMMM YYYY' },
              { value: 'MM-YY-DD', label: 'MM-YY-DD' },
              { value: 'MMM. DD, YY', label: 'MMM. DD, YY' },
              { value: 'YYYY MM DD', label: 'YYYY MM DD' },
              { value: 'YY-MM-DD', label: 'YY-MM-DD' },
            ]}
          />
        </Form.Item>
        
        {/* Custom language selector outside the form system */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ width: '41.66%', textAlign: 'left', paddingRight: '12px' }}>
              <span style={{ color: '#ff4d4f', marginRight: '4px' }}>*</span>
              {translate('Language')}
              <Tooltip title={translate('Changing language will apply immediately')}>
                <InfoCircleOutlined style={{ marginLeft: '8px' }} />
              </Tooltip>
            </label>
            <div style={{ width: '66.66%' }}>
              <Select
                showSearch
                style={{ width: '100%' }}
                value={currentLanguage}
                onChange={handleLanguageChange}
                options={[
                  { value: 'en_us', label: 'English' },
                  { value: 'es_es', label: 'Español' },
                ]}
              />
              <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }}>
                {translate('The page will reload automatically to apply language changes')}
              </div>
            </div>
          </div>
        </div>
        
        <Form.Item
          label={translate('email')}
          name="idurar_app_company_email"
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
}
