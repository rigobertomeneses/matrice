import React from 'react';
import { Link } from 'react-router-dom';

function ServerCounter({ count, loading }) {
  if (loading) {
    return (
      <div data-testid="server-counter" className="bg-blue-700 text-white p-6 rounded-lg shadow-lg flex justify-between items-center animate-pulse">
        <div>
          <div className="h-4 bg-white/30 rounded w-32 mb-3"></div>
          <div className="h-10 bg-white/30 rounded w-20"></div>
        </div>
        <div className="bg-white/30 rounded-md h-12 w-40"></div>
      </div>
    );
  }

  return (
    <div data-testid="server-counter" className="bg-blue-700 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
      <div>
        <p className="text-sm uppercase tracking-wider opacity-90">Servidores Activos</p>
        <p className="text-4xl font-bold">{count}</p>
      </div>
      <Link
        to="/servers/new"
        className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-md"
      >
        ➕ Nuevo Servidor
      </Link>
    </div>
  );
}

export default ServerCounter;