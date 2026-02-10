// Componente que representa una columna dentro del tablero de conexiones.
// Permite crear nuevos grupos dentro de ella mediante un pequeño formulario.
// Se le puede pasar un "tono" para diferenciar visualmente las columnas si fuera necesario.

import { useState } from 'react'
import Group from './Group'

function Column({
  columna,
  grupos,
  tarjetasPorGrupo,
  onAddGroup,
  onAddCard,
  onCardClick,
  seleccion,
  registrarRef,
  tono = 'warm',
}) {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nombre, setNombre] = useState('')

  const etiquetaColumna = columna === 'izquierda' ? 'Izquierda' : 'Derecha'
  const degradado = 'from-white via-[rgba(227,6,19,0.02)] to-white'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre.trim()) return
    onAddGroup(columna, nombre.trim())
    setNombre('')
    setMostrarForm(false)
  }

  return (
    <div className={`panel-suave relative flex min-h-[480px] w-full max-w-[360px] flex-col gap-4 rounded-2xl p-3 shadow-lg bg-gradient-to-b ${degradado}`}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold">
            {/* Usamos el color corporativo para resaltar el título de la columna */}
            <span className="text-[#E30613]">Columna</span>{' '}
            <span className="text-[var(--texto)]">{etiquetaColumna}</span>
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setMostrarForm(true)}
          className="boton-principal inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--acento)] focus:ring-offset-2"
        >
          + Crear grupo
        </button>
      </div>

      {/* Formulario sencillo para capturar el nombre del nuevo grupo */}
      {mostrarForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[rgba(227,6,19,0.18)] bg-white/85 p-3 shadow-sm"
        >
          <label className="block text-sm font-semibold text-[var(--texto)]">Nombre del grupo</label>
          <input
            autoFocus
            className="entrada-suave mt-2 w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--acento)]"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej: Flujos"
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

      {/* Listado de los grupos que pertenecen a esta columna */}
      <div className="flex flex-1 flex-col gap-3">
        {grupos.map((grupo) => (
          <Group
            key={grupo.id}
            grupo={grupo}
            tarjetas={tarjetasPorGrupo.get(grupo.id) || []}
            onAddCard={onAddCard}
            onCardClick={onCardClick}
            seleccion={seleccion}
            registrarRef={registrarRef}
          />
        ))}
      </div>
    </div>
  )
}

export default Column
