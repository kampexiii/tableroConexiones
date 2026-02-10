// Punto de entrada principal de la aplicación React.
// Se encarga de montar el componente App en el nodo 'root' del DOM.
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
