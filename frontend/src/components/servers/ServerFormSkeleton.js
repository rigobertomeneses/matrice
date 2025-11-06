import React from 'react';

/**
 * Skeleton loader para el formulario de servidor
 * Replica la estructura visual del formulario mientras se cargan los datos
 */
function ServerFormSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full animate-pulse">
      {/* Título */}
      <div className="mb-6 pb-3 border-b border-gray-200">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
      </div>

      <div className="space-y-4">
        {/* Campo Nombre */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
          <div className="h-10 bg-gray-100 rounded-md border border-gray-200"></div>
        </div>

        {/* Campo Descripción */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-24 bg-gray-100 rounded-md border border-gray-200"></div>
          <div className="h-3 bg-gray-100 rounded w-12 mt-1"></div>
        </div>

        {/* Host e IP en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo Host */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
            <div className="h-10 bg-gray-100 rounded-md border border-gray-200"></div>
          </div>

          {/* Campo IP */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-10 bg-gray-100 rounded-md border border-gray-200"></div>
          </div>
        </div>

        {/* Campo Imagen */}
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
          <div className="h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-200"></div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-4 mt-6 border-t">
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
          <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default ServerFormSkeleton;
