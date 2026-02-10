// Componente que representa cada una de las tarjetas interactivas.
// Cambia su estilo visual cuando está seleccionada para indicar que se puede conectar.
// Se apoya en una referencia para que el componente padre calcule las posiciones de las líneas.

import { useCallback } from 'react'

function Card({ tarjeta, onClick, seleccion, registrarRef }) {
  const activa = seleccion?.tarjetaId === tarjeta.id

  // Notificamos al componente Board sobre el nodo DOM para el trazado del SVG.
  const refCb = useCallback(
    (node) => {
      registrarRef(tarjeta.id, node)
    },
    [registrarRef, tarjeta.id]
  )

  return (
    <button
      type="button"
      ref={refCb}
      onClick={() => onClick(tarjeta.id, tarjeta.columna)}
      className={`group w-full rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold text-[var(--texto)] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--acento)]/80 ${
        activa
          ? 'border-2 border-[var(--acento)] ring-4 ring-[var(--acento)]/25'
          : 'border border-[rgba(17,17,17,0.08)] hover:-translate-y-0.5 hover:shadow-md'
      }`}
      aria-pressed={activa}
    >
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[var(--acento)]" aria-hidden />
        {tarjeta.nombre}
      </span>
      {/* Indicador visual de si la tarjeta actúa como origen o destino */}
      <span className="mt-1 block text-xs font-medium text-[var(--texto)]/70">
        {tarjeta.columna === 'izquierda' ? 'Origen' : 'Destino'}
      </span>
    </button>
  )
}

export default Card
