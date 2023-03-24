import '@fontsource/inconsolata/400.css';
import './style.css';

import { isRegistered, register } from '@tauri-apps/api/globalShortcut';
import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

void isRegistered('CommandOrControl+Shift+C').then((registered) => {
  if (!registered)
    void register('CommandOrControl+Shift+C', () => {
      void appWindow.show();
      appWindow.center().catch(console.error);
    });
});

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
