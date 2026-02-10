// Configuración de Vite para el entorno de desarrollo y construcción.
// Incluimos soporte para React y la nueva versión de Tailwind CSS.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        open: false,
    },
})
