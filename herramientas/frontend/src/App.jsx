// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Pedido from './components/Pedidos/pedido';
import Stock from './components/Stock/Stock';
import Inicio from './components/Inicio';
import Footer from './components/Footer';
import BolsoListado from './components/bolsos/BolsoListado';

function App() {
  return (
    <Router>
      {/* Contenedor con flex para que footer quede abajo */}
      <div className="d-flex flex-column min-vh-100">
        <Menu />
        {/* Este main ocupa el espacio disponible */}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/pedidos" element={<Pedido />} />
            <Route path="/stock" element={<Stock />} />
            <Route path='/bolso' element={<BolsoListado />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

