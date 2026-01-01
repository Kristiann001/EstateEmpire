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
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
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
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;