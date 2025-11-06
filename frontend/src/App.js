import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Páginas
import ServerListPage from './pages/ServerListPage';
import ServerFormPage from './pages/ServerFormPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/servers" replace />} />
        <Route path="/servers" element={<ServerListPage />} />
        <Route path="/servers/new" element={<ServerFormPage />} />
        <Route path="/servers/edit/:id" element={<ServerFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
