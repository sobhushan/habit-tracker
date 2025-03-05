import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { DashboardProvider } from "./context/DashboardProvider";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
     <DashboardProvider>
      <App />
     </DashboardProvider>
  </React.StrictMode>,
)

