import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Rent from './components/Rent';
import Buy from './components/Buy';
import RentalDetail from './components/RentalDetail';
import PurchaseDetail from './components/PurchaseDetail';
import AgentPage from './components/AgentPage/AgentPage';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailVerification from './components/EmailVerification';
import Rented from './components/Rented';
import Purchased from './components/Purchased';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rental/:id" element={<RentalDetail />} />
        <Route path="/purchase/:id" element={<PurchaseDetail />} />
        <Route path="/agent" element={<AgentPage />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path ="/rented" element={<Rented />} />
        <Route path ="/purchased" element= {<Purchased />} />

      </Routes>
    </Router>
  );
}

<AgentPage />

export default App;