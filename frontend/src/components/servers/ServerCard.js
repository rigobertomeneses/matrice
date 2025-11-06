import React from 'react';

function ServerCard({ server, onDelete, onEdit, order }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-grab active:cursor-grabbing">
      <div className="flex items-center gap-4 p-4">
        {/* Número de orden y drag handle */}
        <div className="flex flex-col items-center justify-center bg-blue-700 text-white rounded-lg p-3 min-w-[60px]">
          <span className="text-xs uppercase font-semibold opacity-90">Orden</span>
          <span className="text-2xl font-bold">{order}</span>
          <span className="text-lg opacity-75 cursor-grab">⋮⋮</span>
        </div>

        {/* Imagen */}
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
          {server.image_url ? (
            <img
              src={server.image_url}
              alt={server.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-blue-700 w-full h-full flex items-center justify-center">
              <span className="text-white text-3xl">🖥️</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
            {server.name}
          </h3>
          {server.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-1">
              {server.description}
            </p>
          )}
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Host:</span>
              <span className="text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded text-xs">
                {server.host}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-700">IP:</span>
              <span className="text-gray-900 font-mono bg-gray-50 px-2 py-0.5 rounded text-xs">
                {server.ip_address}
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(server)}
            className="bg-blue-600 text-white w-10 h-10 rounded-md text-lg font-medium hover:bg-blue-700 flex items-center justify-center transition-colors"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(server.id)}
            className="bg-red-600 text-white w-10 h-10 rounded-md text-lg font-medium hover:bg-red-700 flex items-center justify-center transition-colors"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServerCard;