import React, { createContext, useState, useContext, useEffect } from 'react';
import { ONLINE_API_URL, LOCAL_API_URL } from '../config';

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const isLocalMode = localStorage.getItem('datasense_api_mode') === 'local';
  const apiBaseUrl = isLocalMode ? LOCAL_API_URL : ONLINE_API_URL;

  const toggleApiMode = () => {
    localStorage.setItem('datasense_api_mode', isLocalMode ? 'online' : 'local');
    window.location.reload();
  };

  return (
    <ApiContext.Provider value={{ apiBaseUrl, isLocalMode, toggleApiMode }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
