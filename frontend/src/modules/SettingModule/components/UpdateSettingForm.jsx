import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Button, Form, message } from 'antd';
import Loading from '@/components/Loading';
import useLanguage from '@/locale/useLanguage';

export default function UpdateSettingForm({ config, children, withUpload, uploadSettingKey }) {
  let { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading, isSuccess } = useSelector(selectSettings);
  const translate = useLanguage();
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Used to prevent duplicate form submissions
  const onSubmit = (fieldsValue) => {
    // Prevent duplicate submission
    if (isSubmitting) {
      console.log("[DEBUG] Form submission already in progress, ignoring");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Special handling for language change to prevent loops
      const isChangingLanguage = fieldsValue.idurar_app_language && 
        fieldsValue.idurar_app_language !== localStorage.getItem('language');
      
      console.log("[DEBUG] Submitting form, values:", fieldsValue);
      console.log("[DEBUG] isChangingLanguage:", isChangingLanguage);

      if (withUpload) {
        if (fieldsValue.file) {
          fieldsValue.file = fieldsValue.file[0].originFileObj;
        }
        dispatch(
          settingsAction.upload({ entity, settingKey: uploadSettingKey, jsonData: fieldsValue })
        );
      }
      
      // Always prepare settings array
      const settings = [];
      for (const [key, value] of Object.entries(fieldsValue)) {
        settings.push({ settingKey: key, settingValue: value });
      }

      // Special handling for language change
      if (isChangingLanguage) {
        console.log("[DEBUG] Handling language change to:", fieldsValue.idurar_app_language);
        
        // Update localStorage immediately for language
        localStorage.setItem('language', fieldsValue.idurar_app_language);
        
        // For Spanish, use the special URL approach 
        if (fieldsValue.idurar_app_language === 'es_es') {
          dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }));
          
          // Use our special parameter approach
          console.log("[DEBUG] Using forceSpanish URL parameter for reliable Spanish change");
          setTimeout(() => {
            window.location.href = window.location.href.split('?')[0] + '?forceSpanish=true';
          }, 300);
          return;
        }
        
        // For other languages, use standard approach
        dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }));
        
        // Reload after a delay for language change to take effect
        console.log("[DEBUG] Reloading page to apply language change");
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } 
      // For non-language changes, just update normally
      else {
        dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }));
        
        // Show a message instead of endless "Request success" notifications
        message.success(translate('Settings updated successfully'));
      }
    } catch (error) {
      console.error("[ERROR] Error submitting form:", error);
      message.error(translate('Error updating settings'));
    } finally {
      // Reset submission state after a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const current = result[settingsCategory];
    form.setFieldsValue(current);
  }, [result]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 10 }}
          labelAlign="left"
          wrapperCol={{ span: 16 }}
        >
          {children}
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              {translate('Save')}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
