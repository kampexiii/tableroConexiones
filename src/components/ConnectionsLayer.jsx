// Capa superior encargada de dibujar las conexiones mediante un SVG.
// Calculamos las coordenadas de inicio y fin basándonos en las posiciones de las tarjetas.
// Escucha el evento de redimensión para mantener las líneas siempre alineadas.

import { useCallback, useLayoutEffect, useState } from 'react'

function ConnectionsLayer({ contenedorRef, conexiones, tarjetaRefs }) {
  const [lineas, setLineas] = useState([])

  const calcularPaths = useCallback(() => {
    const contenedor = contenedorRef.current
    if (!contenedor) return

    // Obtenemos las dimensiones del contenedor para calcular posiciones relativas.
    const rectContenedor = contenedor.getBoundingClientRect()
    const nuevos = []

    conexiones.forEach((conexion) => {
      const nodoIzq = tarjetaRefs.current.get(conexion.izquierdaId)
      const nodoDer = tarjetaRefs.current.get(conexion.derechaId)
      if (!nodoIzq || !nodoDer) return

      const r1 = nodoIzq.getBoundingClientRect()
      const r2 = nodoDer.getBoundingClientRect()

      // Calculamos los puntos de anclaje de las líneas (de centro a centro lateral).
      const startX = r1.right - rectContenedor.left
      const startY = r1.top + r1.height / 2 - rectContenedor.top
      const endX = r2.left - rectContenedor.left
      const endY = r2.top + r2.height / 2 - rectContenedor.top

      nuevos.push({ id: conexion.id, x1: startX, y1: startY, x2: endX, y2: endY })
    })

    setLineas(nuevos)
  }, [conexiones, contenedorRef, tarjetaRefs])

  useLayoutEffect(() => {
    // Actualizamos el trazado de las líneas cuando cambia el estado o se redimensiona la ventana.
    const raf = requestAnimationFrame(calcularPaths)
    const onResize = () => requestAnimationFrame(calcularPaths)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [calcularPaths])

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full z-10" aria-hidden>
      <defs>
        {/* Definición de degradados y sombras para dar un acabado más profesional a las líneas. */}
        <linearGradient id="lineaSuave" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e30613" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#ff4253" stopOpacity="0.9" />
        </linearGradient>
        <filter id="sombraLinea" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(17, 17, 17, 0.1)" />
        </filter>
      </defs>

      {/* Renderizado de cada una de las conexiones activas. */}
      {lineas.map((linea) => (
        <line
          key={linea.id}
          x1={linea.x1}
          y1={linea.y1}
          x2={linea.x2}
          y2={linea.y2}
          stroke="url(#lineaSuave)"
          strokeWidth="4"
          strokeLinecap="round"
          filter="url(#sombraLinea)"
        />
      ))}
    </svg>
  )
}

export default ConnectionsLayer
