import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('🚀 Frontend Starting...');

try {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('✅ React App Mounted Successfully');
} catch (error) {
  console.error('❌ Error mounting React app:', error);
  document.getElementById('root').innerHTML = `
    <div style="background: black; color: white; padding: 20px; font-family: monospace;">
      <h1>Frontend Error</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>
  `;
}
