import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Componentes
import ServerForm from '../components/servers/ServerForm';
import ServerFormSkeleton from '../components/servers/ServerFormSkeleton';

// Hook y servicio
import useServers from '../hooks/useServers';
import { getServer } from '../services/serverService';

function ServerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(false);

  const { createServer, updateServer } = useServers();

  // Si hay id, cargar el servidor para editar
  useEffect(() => {
    if (id) {
      setLoading(true);
      getServer(id)
        .then(data => {
          setServer(data);
          setLoading(false);
        })
        .catch(error => {
          toast.error('No se pudo cargar el servidor');
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      if (id) {
        await updateServer(id, formData);
      } else {
        await createServer(formData);
      }
      // Delay para que el toast se muestre antes de navegar
      setTimeout(() => {
        navigate('/servers');
      }, 1500);
    } catch (error) {
      // El toast de error ya se muestra en el hook useServers
    }
  };

  const handleCancel = () => {
    navigate('/servers');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold">Challenge Rigoberto - Gestión de Servidores</h1>
          <div className="mt-2 text-sm">
            <Link to="/servers" className="hover:underline">
              ← Volver a la lista
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <ServerFormSkeleton />
          ) : (
            <ServerForm
              server={server}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2025 Challenge Rigoberto - Gestión de Servidores</p>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default ServerFormPage;
