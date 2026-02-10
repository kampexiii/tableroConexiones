# Tablero de Conexiones Interactivas

## Descripción del proyecto

Tablero interactivo de dos columnas (Izquierda / Derecha) orientado a representar relaciones entre elementos.
El usuario puede crear grupos y tarjetas (estado inicial vacío) y conectar tarjetas solo entre columnas opuestas mediante un SVG overlay que dibuja líneas en tiempo real.

El diseño sigue una estética corporativa (blanco + rojo marca) y evita dependencias externas de diagramado.

## Tecnologías utilizadas

- **React 18**: componentes y render declarativo.
- **Vite**: entorno de desarrollo y build.
- **Tailwind CSS v4**: layout, espaciados y estados visuales.
- **SVG Overlay**: render de líneas calculadas desde el DOM.

## Estructura del código (por responsabilidades)

- [src/main.jsx](src/main.jsx): montaje de la aplicación.
- [src/App.jsx](src/App.jsx): layout base + composición del tablero.
- [src/components/Board.jsx](src/components/Board.jsx): núcleo (estado global + reglas de interacción con `useReducer`).
- [src/components/Column.jsx](src/components/Column.jsx): render de columna + creación de grupos.
- [src/components/Group.jsx](src/components/Group.jsx): render de grupo + creación de tarjetas.
- [src/components/Card.jsx](src/components/Card.jsx): tarjeta interactiva (selección + registro DOM por id).
- [src/components/ConnectionsLayer.jsx](src/components/ConnectionsLayer.jsx): SVG overlay (cálculo de anclajes + dibujo de líneas).
- [src/styles/index.css](src/styles/index.css): tokens/variables + estilos globales.

## Modelo de estado (normalizado)

Para evitar anidaciones difíciles de mantener, el estado está normalizado:

- **grupos[]**: `{ id, columna, nombre }`
- **tarjetas[]**: `{ id, grupoId, columna, nombre }`
- **conexiones[]**: `{ izquierdaId, derechaId }` (siempre normalizado cruzado)
- **seleccion**: `{ tarjetaId, columna } | null` (estado temporal de interacción)

**Motivo**: acceso directo por id, validaciones simples y reglas de conexión consistentes.

## Por qué useReducer (decisión clave)

Aunque para una UI pequeña `useState` podría valer, aquí se mantiene `useReducer` porque el evento principal (`CLICK_CARD`) concentra reglas que se vuelven fáciles de romper si se dispersan en handlers:

- Selección / deselección.
- Cambio de selección dentro de la misma columna (sin conexión).
- Toggle (si la pareja ya existe, se elimina).
- Normalización izquierda ↔ derecha (guardar siempre `{ izquierdaId, derechaId }`).
- Restricción 1–a–1 (reemplazo de conexiones previas).
- Evitar duplicados y mantener consistencia.

Al llevarlo a un reducer:

- La lógica queda centralizada y predecible.
- El componente se mantiene más limpio.
- Si el proyecto creciera, es más fácil de testear (reducer puro) y de ampliar sin introducir casos raros.

**Implementación**: [Board.jsx](src/components/Board.jsx) (ver acción `CLICK_CARD` alrededor de la línea 85).

## Lógica de interacción (click-to-connect)

La interacción se resuelve como una máquina de estados mínima:

1. **Sin selección** → seleccionar tarjeta.
2. **Click en la misma** → deseleccionar.
3. **Click en misma columna** → mover selección (no conecta).
4. **Click en columna opuesta** → conexión:
   - Si la pareja ya existe → toggle (eliminar).
   - Si no existe → crear (aplicando regla 1–a–1).

## Regla 1–a–1 (conexión única)

Cada tarjeta puede tener un único vínculo activo. Al conectar A ↔ B:

- Se eliminan conexiones previas donde participe A.
- Se eliminan conexiones previas donde participe B.
- Se añade la nueva conexión A ↔ B.
  (si A ↔ B ya existía, se elimina por toggle)

**Resultado**: no existe un caso donde una tarjeta termine conectada a dos destinos.

## Dibujo de líneas (SVG overlay)

Las líneas no son estado: son representación.

### Por qué overlay

El SVG va en overlay (`absolute inset-0`) para evitar recortes por overflow/layout de columnas y para permitir que la línea cruce el espacio central. Además usa `pointer-events: none` para no interferir con los clicks.

### Cálculo de anclajes

Cada Card registra su nodo DOM en un Map (`id -> HTMLElement`). Por cada conexión:

1. Se obtiene el rectángulo con `getBoundingClientRect()`.
2. **Punto A**: borde derecho de tarjeta izquierda (centro vertical).
3. **Punto B**: borde izquierdo de tarjeta derecha (centro vertical).
4. Conversión viewport → tablero restando `boardRect.left/top`.

### Sincronización

Para evitar lecturas de layout inconsistentes:

- Cálculo tras render con `useLayoutEffect` + `requestAnimationFrame`.
- Recalculo en `resize` para mantener alineación.

## Características técnicas

- Estado inicial vacío (sin datos precargados).
- Conexiones cruzadas únicamente (Izquierda ↔ Derecha).
- Restricción 1–a–1 aplicada a nivel de lógica, no solo UI.
- Líneas recalculadas al modificar contenido o redimensionar.
