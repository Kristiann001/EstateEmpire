import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Rent from './components/Rent';
import Buy from './components/Buy';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} /> 
      </Routes>
    </Router>
  );
}

export default App;
