// Componente principal del tablero de conexiones.
// Centraliza los grupos, tarjetas y las relaciones entre ellas.
// Usamos useReducer para manejar la lógica de conexiones, que es la parte más compleja del flujo.

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import Column from './Column'
import ConnectionsLayer from './ConnectionsLayer'

// Generamos IDs únicos para los nuevos elementos; usamos crypto si está disponible.
const crearId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10))

const ESTADO_BASE = {
  grupos: [],
  tarjetas: [],
  conexiones: [],
  seleccion: null, // Guardamos la tarjeta pulsada para intentar conectarla después.
}

const ACTIONS = {
  ADD_GROUP: 'ADD_GROUP',
  ADD_CARD: 'ADD_CARD',
  CLICK_CARD: 'CLICK_CARD',
  LOAD_STATE: 'LOAD_STATE',
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_GROUP: {
      // Agregamos un nuevo grupo a la columna correspondiente.
      const { columna, nombre } = action.payload
      const nuevoGrupo = { id: crearId(), columna, nombre }
      return { ...state, grupos: [...state.grupos, nuevoGrupo] }
    }
    case ACTIONS.ADD_CARD: {
      // Las tarjetas se vinculan a un grupo y mantienen su posición en la columna.
      const { grupoId, columna, nombre } = action.payload
      const nuevaTarjeta = { id: crearId(), grupoId, columna, nombre }
      return { ...state, tarjetas: [...state.tarjetas, nuevaTarjeta] }
    }
    case ACTIONS.CLICK_CARD: {
      const { tarjetaId, columna } = action.payload
      const seleccion = state.seleccion

      // Lógica de interacción para las conexiones:
      // 1. Si no hay nada seleccionado, marcamos la actual.
      // 2. Si pulsamos la misma, anulamos la selección.
      // 3. Si es de la misma columna, cambiamos la selección.
      // 4. Si es de la columna opuesta, creamos o eliminamos la conexión.
      if (!seleccion) {
        return { ...state, seleccion: { tarjetaId, columna } }
      }

      if (seleccion.tarjetaId === tarjetaId) {
        return { ...state, seleccion: null }
      }

      if (seleccion.columna === columna) {
        return { ...state, seleccion: { tarjetaId, columna } }
      }

      const izquierdaId = columna === 'izquierda' ? tarjetaId : seleccion.tarjetaId
      const derechaId = columna === 'derecha' ? tarjetaId : seleccion.tarjetaId

      // Controlamos si el vínculo ya existe para aplicar un efecto de "toggle".
      const existe = state.conexiones.some(
        (c) => c.izquierdaId === izquierdaId && c.derechaId === derechaId
      )

      // Por ahora mantenemos conexiones 1-a-1, eliminando vínculos antiguos al crear uno nuevo.
      const sinVinculosPrevios = state.conexiones.filter(
        (c) => c.izquierdaId !== izquierdaId && c.derechaId !== derechaId
      )

      const nuevasConexiones = existe
        ? sinVinculosPrevios
        : [...sinVinculosPrevios, { id: crearId(), izquierdaId, derechaId }]

      return { ...state, conexiones: nuevasConexiones, seleccion: null }
    }
    case ACTIONS.LOAD_STATE: {
      return action.payload
    }
    default:
      return state
  }
}

function Board() {
  const contenedorRef = useRef(null)
  const tarjetaRefs = useRef(new Map()) // Almacenamos los nodos DOM para calcular las líneas del SVG.

  const [state, dispatch] = useReducer(reducer, ESTADO_BASE)

  useEffect(() => {
    // Pequeño log para verificar que el estado de las conexiones se actualiza correctamente.
    console.log('[Board] conexiones actuales:', state.conexiones)
  }, [state.conexiones])

  const gruposPorColumna = useMemo(
    () => ({
      izquierda: state.grupos.filter((g) => g.columna === 'izquierda'),
      derecha: state.grupos.filter((g) => g.columna === 'derecha'),
    }),
    [state.grupos]
  )

  const tarjetasPorGrupo = useMemo(() => {
    const mapa = new Map()
    state.tarjetas.forEach((t) => {
      if (!mapa.has(t.grupoId)) mapa.set(t.grupoId, [])
      mapa.get(t.grupoId).push(t)
    })
    return mapa
  }, [state.tarjetas])

  // Función para registrar las referencias de las tarjetas desde los componentes hijos.
  const registrarRef = useCallback((id, node) => {
    if (node) {
      tarjetaRefs.current.set(id, node)
    } else {
      tarjetaRefs.current.delete(id)
    }
  }, [])

  const handleAddGroup = (columna, nombre) => {
    dispatch({ type: ACTIONS.ADD_GROUP, payload: { columna, nombre } })
  }

  const handleAddCard = (grupoId, columna, nombre) => {
    dispatch({ type: ACTIONS.ADD_CARD, payload: { grupoId, columna, nombre } })
  }

  const handleClickCard = (tarjetaId, columna) => {
    dispatch({ type: ACTIONS.CLICK_CARD, payload: { tarjetaId, columna } })
  }

  return (
    <section className="relative">
      <div
        ref={contenedorRef}
        className="panel-suave relative flex gap-12 rounded-3xl p-6 shadow-xl sm:p-8 lg:gap-16 lg:p-10"
      >
        <div className="grid w-full grid-cols-3 gap-12 lg:gap-16">
          <div className="flex justify-start">
            <Column
              columna="izquierda"
              grupos={gruposPorColumna.izquierda}
              tarjetasPorGrupo={tarjetasPorGrupo}
              onAddGroup={handleAddGroup}
              onAddCard={handleAddCard}
              onCardClick={handleClickCard}
              seleccion={state.seleccion}
              registrarRef={registrarRef}
              tono="warm"
            />
          </div>
          <div aria-hidden className="" />
          <div className="flex justify-end">
            <Column
              columna="derecha"
              grupos={gruposPorColumna.derecha}
              tarjetasPorGrupo={tarjetasPorGrupo}
              onAddGroup={handleAddGroup}
              onAddCard={handleAddCard}
              onCardClick={handleClickCard}
              seleccion={state.seleccion}
              registrarRef={registrarRef}
              tono="cool"
            />
          </div>
        </div>

        <ConnectionsLayer
          contenedorRef={contenedorRef}
          conexiones={state.conexiones}
          tarjetaRefs={tarjetaRefs}
        />
      </div>
    </section>
  )
}

export default Board
