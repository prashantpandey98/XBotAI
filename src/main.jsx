import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    primary: {
      main: '#9c88ff',
    },
    secondary: {
      main: '#6c5ce7',
    },
    background: {
      default: '#f5f5f5',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Ubuntu", "Open Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    h2: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    h3: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    h4: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    h5: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    h6: {
      fontFamily: '"Ubuntu", sans-serif',
    },
    body1: {
      fontFamily: '"Open Sans", sans-serif',
    },
    body2: {
      fontFamily: '"Open Sans", sans-serif',
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
