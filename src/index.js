import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppRoutes from './Routes';
import { PostHogProvider } from 'posthog-js/react';

const options = {
  api_host: 'https://eu.i.posthog.com',
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey="phc_TIvG0m8qfb14z91GAVd1CCLibMZSCWedNl9lyZh3ODW"
      options={options}
    >
      <AppRoutes />
    </PostHogProvider>
  </React.StrictMode>
);
