import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './Routes';
import { PostHogProvider } from 'posthog-js/react';

const apiKey = process.env.REACT_APP_PUBLIC_POSTHOG_KEY;
const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={apiKey}
      options={options}
    >
      <AppRoutes />
    </PostHogProvider>
  </React.StrictMode>
);
