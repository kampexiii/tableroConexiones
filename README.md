# Tablero de Conexiones Interactivas

## Descripción del Proyecto

Este proyecto consiste en un tablero interactivo de dos columnas diseñado para gestionar visualmente flujos de trabajo mediante la creación de grupos y tarjetas. La característica principal es un sistema de conexiones dinámicas en tiempo real mediante una capa SVG que vincula elementos entre ambas columnas.

Desarrollado como parte de una prueba técnica, el sitio sigue una estética profesional y corporativa utilizando una paleta de colores en blanco y rojo.

## Tecnologías Utilizadas

- **React 18**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Entorno de desarrollo rápido.
- **Tailwind CSS v4**: Framework de estilos para un diseño moderno y responsive.
- **SVG**: Para el trazado de las líneas de conexión dinámicas.

## Cómo ejecutar el proyecto

1. **Instalar dependencias**: `npm install`
2. **Lanzar en modo desarrollo**: `npm run dev`
3. **Acceso**: Abre la URL proporcionada por Vite (habitualmente [http://localhost:5173](http://localhost:5173)). Si el puerto está ocupado, Vite usará automáticamente el siguiente disponible (ej. 5174).

## Estructura del Código

- [src/main.jsx](src/main.jsx): Punto de entrada y montaje de la aplicación.
- [src/App.jsx](src/App.jsx): Layout general y estructura base.
- [src/components/Board.jsx](src/components/Board.jsx): Corazón del proyecto. Gestiona el estado (grupos, tarjetas, conexiones) mediante `useReducer`.
- [src/components/Column.jsx](src/components/Column.jsx): Renderiza las columnas laterales y gestiona la creación de grupos.
- [src/components/Group.jsx](src/components/Group.jsx): Agrupa tarjetas y permite la creación de nuevos elementos.
- [src/components/Card.jsx](src/components/Card.jsx): Componente interactivo con estados de selección y registro de referencias DOM.
- [src/components/ConnectionsLayer.jsx](src/components/ConnectionsLayer.jsx): Capa SVG que calcula y dibuja las líneas de conexión entre tarjetas.
- [src/styles/index.css](src/styles/index.css): Configuración de temas y estilos globales.

## Características Técnicas

- **Lógica de Conexión 1-a-1**: Cada tarjeta puede tener un único vínculo activo, garantizando una visualización limpia y ordenada.
- **Cálculo de trayectorias en tiempo real**: Las líneas se recalculan automáticamente al redimensionar la ventana o modificar el contenido.
- **Estado Normalizado**: Uso eficiente de la memoria y el renderizado mediante una estructura de datos plana en el estado principal.

# tableroConexiones
