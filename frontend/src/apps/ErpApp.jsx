import { useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAppSettings } from '@/redux/settings/selectors';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';

import HeaderContent from '@/apps/Header/HeaderContainer';
import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';

import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';

export default function ErpCrmApp() {
  const { Content } = Layout;

  // const { state: stateApp, appContextAction } = useAppContext();
  // // const { app } = appContextAction;
  // const { isNavMenuClose, currentApp } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  // Load settings only once at startup
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const appSettings = useSelector(selectAppSettings);
  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  // Use a ref to track if we've already processed the language sync
  useEffect(() => {
    // Skip this effect if settings aren't loaded yet
    if (!appSettings || !appSettings.idurar_app_language) return;
    
    // Get URL parameters 
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    const forceSpanish = urlParams.get('forceSpanish');
    
    // Skip any processing if we have special URL parameters - useLanguage.jsx will handle these
    if (urlLang || forceSpanish) return;
    
    // Get current localStorage language
    const currentLang = window.localStorage.getItem('language');
    
    // Only update if the localStorage language differs from Redux AND 
    // it's not a case where localStorage is 'es_es' (we want to preserve Spanish)
    if (currentLang !== appSettings.idurar_app_language && currentLang !== 'es_es') {
      console.log("[DEBUG] Syncing localStorage language with Redux:", appSettings.idurar_app_language);
      window.localStorage.setItem('language', appSettings.idurar_app_language);
    }
  }, [appSettings]);

  if (settingIsloaded)
    return (
      <Layout hasSider style={{ minHeight: '100vh', background: '#f5f6fa' }}>
        <Navigation />

        {isMobile ? (
          <Layout style={{ marginLeft: 0 }}>
            <HeaderContent />
            <Content
              style={{
                margin: '20px auto',
                overflow: 'initial',
                width: '100%',
                padding: '0 15px',
                maxWidth: 'none',
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        ) : (
          <Layout style={{ background: '#f5f6fa' }}>
            <HeaderContent />
            <Content
              style={{
                margin: '20px auto',
                overflow: 'initial',
                width: '100%',
                padding: '0 30px',
                maxWidth: 1400,
              }}
            >
              <AppRouter />
            </Content>
          </Layout>
        )}
      </Layout>
    );
  else return <PageLoader />;
}
