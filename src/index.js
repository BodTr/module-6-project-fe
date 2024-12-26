import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import App from './App'
import store from './store'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <App />
      <ToastContainer />
    </StyledEngineProvider>
  </Provider>,
)
