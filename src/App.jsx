// Componente raíz de la aplicación que establece la estructura general.

import Board from './components/Board'
import logo from './assets/img/logo.svg'

function App() {
  return (
    <div className="min-h-screen px-4 py-10 sm:px-8">
      <header className="flex w-full justify-center">
        <img src={logo} alt="Implemental Systems" className="h-12 sm:h-14" />
      </header>

      <main className="relative mx-auto mt-10 max-w-6xl">
        {/* Cargamos el componente del tablero que contiene la lógica de negocio */}
        <Board />
      </main>
    </div>
  )
}

export default App
