// Componente que agrupa varias tarjetas dentro de una columna.
// Ofrece la interfaz para añadir nuevas tarjetas mediante un formulario.

import { useState } from 'react'
import Card from './Card'

function Group({ grupo, tarjetas, onAddCard, onCardClick, seleccion, registrarRef }) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')

  const handleSubmit = (e) => {
    // Evitamos el comportamiento por defecto del formulario para que no se recargue la página.
    e.preventDefault()
    if (!nombre.trim()) return
    onAddCard(grupo.id, grupo.columna, nombre.trim())
    setNombre('')
    setMostrarForm(false)
  }

  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-[var(--texto)]">{grupo.nombre}</h3>
        <button
          type="button"
          onClick={() => setMostrarForm(true)}
          className="text-xs font-semibold text-[var(--acento)] underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
        >
          + Crear tarjeta
        </button>
      </div>

      {/* Formulario que se despliega para introducir el nombre de la nueva tarjeta */}
      {mostrarForm && (
        <form onSubmit={handleSubmit} className="mt-3 rounded-xl border border-[rgba(227,6,19,0.18)] bg-white/85 p-3 shadow-inner">
          <label className="block text-sm font-semibold text-[var(--texto)]">Nombre de la tarjeta</label>
          <input
            autoFocus
            className="entrada-suave mt-2 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Validar copy"
          />
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="boton-principal inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
            >
              OK
            </button>
            <button
              type="button"
              onClick={() => {
                setMostrarForm(false)
                setNombre('')
              }}
              className="boton-fantasma inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Listado de tarjetas vinculadas a este grupo */}
      <div className="mt-3 space-y-2">
        {tarjetas.length === 0 && (
          <p className="text-sm text-[var(--texto)]/70">Sin tarjetas aún.</p>
        )}
        {tarjetas.map((tarjeta) => (
          <Card
            key={tarjeta.id}
            tarjeta={tarjeta}
            onClick={onCardClick}
            seleccion={seleccion}
            registrarRef={registrarRef}
          />
        ))}
      </div>
    </div>
  )
}

export default Group
