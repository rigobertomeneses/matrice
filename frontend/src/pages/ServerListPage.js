import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import ServerList from '../components/servers/ServerList';
import ServerCounter from '../components/servers/ServerCounter';
import ConfirmModal from '../components/common/ConfirmModal';

// Hook
import useServers from '../hooks/useServers';

function ServerListPage() {
  const {
    servers,
    loading,
    error,
    serverCount,
    deleteServer,
    updateServerOrder
  } = useServers();

  // Estado para el modal de confirmación
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    serverId: null
  });

  const handleDelete = (id) => {
    setDeleteModal({
      isOpen: true,
      serverId: id
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.serverId) {
      await deleteServer(deleteModal.serverId);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      serverId: null
    });
  };

  const handleReorder = async (reorderedServers) => {
    try {
      await updateServerOrder(reorderedServers);
    } catch (error) {
      // Error manejado por el hook
    }
  };

  const handleEdit = (server) => {
    // Navegar a la página de edición con el id
    window.location.href = `/servers/edit/${server.id}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold">Challenge Rigoberto - Gestión de Servidores</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">

      {/* Contador */}
      <div className="mb-6">
        <ServerCounter count={serverCount} loading={loading} />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 text-center">⚠️ {error}</p>
        </div>
      )}

      {/* Lista */}
      <ServerList
        servers={servers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onReorder={handleReorder}
        loading={loading}
      />

        {/* Toast */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
        />

        {/* Modal de confirmación */}
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este servidor? Esta acción no se puede deshacer."
        />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Challenge Rigoberto - Gestión de Servidores</p>
        </div>
      </footer>
    </div>
  );
}

export default ServerListPage;
