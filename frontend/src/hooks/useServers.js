import { useState, useEffect, useCallback } from 'react';
import serverService from '../services/serverService';
import { toast } from 'react-toastify';

/**
 * Custom hook para manejar el estado y operaciones de servidores
 */
const useServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverCount, setServerCount] = useState(0);

  // Cargar servidores
  const fetchServers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await serverService.getAll();
      setServers(Array.isArray(data) ? data : []);
      setServerCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      setError('Error al cargar los servidores');
      toast.error('Error al cargar los servidores');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear servidor
  const createServer = async (serverData) => {
    setError(null);
    try {
      const data = await serverService.create(serverData);
      await fetchServers(); // Recargar lista
      toast.success('Servidor creado exitosamente');
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al crear el servidor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Actualizar servidor
  const updateServer = async (id, serverData) => {
    setError(null);
    try {
      const data = await serverService.update(id, serverData);
      await fetchServers(); // Recargar lista
      toast.success('Servidor actualizado exitosamente');
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al actualizar el servidor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Eliminar servidor
  const deleteServer = async (id) => {
    setError(null);
    try {
      await serverService.delete(id);
      await fetchServers(); // Recargar lista
      toast.success('Servidor eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al eliminar el servidor';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  // Actualizar orden (para drag & drop)
  const updateServerOrder = async (reorderedServers) => {
    setError(null);
    // Actualizar localmente primero para UI responsiva
    setServers(reorderedServers);

    try {
      await serverService.updateOrder(reorderedServers);
      toast.success('Orden actualizado');
    } catch (err) {
      // Si falla, recargar del servidor
      await fetchServers();
      const errorMessage = err.response?.data?.message || 'Error al actualizar el orden';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Cargar servidores al montar el componente
  useEffect(() => {
    fetchServers();
  }, [fetchServers]);

  return {
    servers,
    loading,
    error,
    serverCount,
    fetchServers,
    createServer,
    updateServer,
    deleteServer,
    updateServerOrder,
  };
};

export default useServers;