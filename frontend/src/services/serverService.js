import api from './api';

/**
 * Servicio para manejar todas las operaciones con servidores
 */
const serverService = {
  /**
   * Obtener todos los servidores
   */
  getAll: async () => {
    try {
      const response = await api.get('/servers');
      return response.data.data; // Extraer el array data interno
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener un servidor por ID
   */
  getById: async (id) => {
    try {
      const response = await api.get(`/servers/${id}`);
      return response.data.data; // Extraer el objeto data interno
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear un nuevo servidor
   * Siempre usa FormData para consistencia
   */
  create: async (serverData) => {
    try {
      // Siempre usar FormData para consistencia
      const formData = new FormData();
      formData.append('name', serverData.name || '');
      formData.append('description', serverData.description || '');
      formData.append('host', serverData.host || '');
      formData.append('ip_address', serverData.ip_address || '');

      if (serverData.image) {
        formData.append('image', serverData.image);
      }

      const response = await api.post('/servers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data; // Extraer el objeto data interno
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar un servidor
   * Siempre usa FormData para consistencia
   */
  update: async (id, serverData) => {
    try {
      // Siempre usar FormData para consistencia
      const formData = new FormData();

      // Agregar todos los campos (el backend manejará qué actualizar)
      formData.append('name', serverData.name || '');
      formData.append('description', serverData.description || '');
      formData.append('host', serverData.host || '');
      formData.append('ip_address', serverData.ip_address || '');

      if (serverData.sort_order !== undefined) {
        formData.append('sort_order', serverData.sort_order);
      }

      if (serverData.image) {
        formData.append('image', serverData.image);
      }

      // Laravel espera PUT pero FormData solo funciona con POST, usar _method
      formData.append('_method', 'PUT');

      const response = await api.post(`/servers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data; // Extraer el objeto data interno
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar un servidor
   */
  delete: async (id) => {
    try {
      const response = await api.delete(`/servers/${id}`);
      return response.data.data; // Extraer el objeto data interno
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar el orden de los servidores (para drag & drop)
   */
  updateOrder: async (servers) => {
    try {
      const response = await api.post('/servers/update-order', {
        servers: servers.map((server, index) => ({
          id: server.id,
          sort_order: index
        }))
      });
      return response.data.data; // Extraer el objeto data interno
    } catch (error) {
      throw error;
    }
  },

};

// Export named para conveniencia
export const getServer = serverService.getById;

export default serverService;