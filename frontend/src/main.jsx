import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import '@fontsource-variable/inter/wght.css';import '@fontsource/instrument-serif/latin-400.css';import '@fontsource/instrument-serif/latin-400-italic.css';
import './styles.css';import App from './App.jsx';
createRoot(document.getElementById('root')).render(<BrowserRouter><App/></BrowserRouter>);
