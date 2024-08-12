import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Rent from './components/Rent';
import Buy from './components/Buy';
import Rented from './components/Rented';
import Purchased from './components/Purchased';
import RentalDetail from './components/RentalDetail';
import PurchaseDetail from './components/PurchaseDetail';

function App() {
  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rented" element={<Rented />} />
        <Route path="/purchased" element={<Purchased />} />
        <Route path="/rental/:id" element={<RentalDetail />} />
        <Route path="/purchase/:id" element={<PurchaseDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
