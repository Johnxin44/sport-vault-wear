import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { store } from './store/store'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a1a',
              color: '#F2F0EB',
              border: '1px solid #F5A623',
              borderLeft: '4px solid #F5A623',
              borderRadius: '0px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#F5A623', secondary: '#000' } },
            error:   { style: { borderLeftColor: '#ef4444' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
