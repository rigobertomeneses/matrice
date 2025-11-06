import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServerListPage from './ServerListPage';
import useServers from '../hooks/useServers';

vi.mock('../hooks/useServers');

vi.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('ServerListPage', () => {
  const mockServers = [
    {
      id: 1,
      name: 'Servidor 1',
      description: 'Descripción 1',
      host: 'server1.local',
      ip_address: '192.168.1.1',
      status: true,
      sort_order: 1
    },
    {
      id: 2,
      name: 'Servidor 2',
      description: 'Descripción 2',
      host: 'server2.local',
      ip_address: '192.168.1.2',
      status: true,
      sort_order: 2
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título correctamente', () => {
    useServers.mockReturnValue({
      servers: [],
      loading: false,
      error: null,
      serverCount: 0,
      deleteServer: vi.fn(),
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Challenge Rigoberto - Gestión de Servidores')).toBeInTheDocument();
  });

  it('muestra el contador de servidores', () => {
    useServers.mockReturnValue({
      servers: mockServers,
      loading: false,
      error: null,
      serverCount: 2,
      deleteServer: vi.fn(),
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    const counter = screen.getByTestId('server-counter');
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveTextContent('2');
  });

  it('renderiza la lista de servidores', () => {
    useServers.mockReturnValue({
      servers: mockServers,
      loading: false,
      error: null,
      serverCount: 2,
      deleteServer: vi.fn(),
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Servidor 1')).toBeInTheDocument();
    expect(screen.getByText('Servidor 2')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando hay error', () => {
    const errorMessage = 'Error al cargar servidores';

    useServers.mockReturnValue({
      servers: [],
      loading: false,
      error: errorMessage,
      serverCount: 0,
      deleteServer: vi.fn(),
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
  });

  it('abre modal de confirmación al eliminar', async () => {
    const deleteServerMock = vi.fn();

    useServers.mockReturnValue({
      servers: mockServers,
      loading: false,
      error: null,
      serverCount: 2,
      deleteServer: deleteServerMock,
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    const deleteButtons = screen.getAllByTitle('Eliminar');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    });
  });

  it('llama a deleteServer al confirmar eliminación', async () => {
    const deleteServerMock = vi.fn().mockResolvedValue(true);

    useServers.mockReturnValue({
      servers: mockServers,
      loading: false,
      error: null,
      serverCount: 2,
      deleteServer: deleteServerMock,
      updateServerOrder: vi.fn()
    });

    render(
      <BrowserRouter>
        <ServerListPage />
      </BrowserRouter>
    );

    const deleteButtons = screen.getAllByTitle('Eliminar');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Confirmar eliminación')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: /confirmar|eliminar/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(deleteServerMock).toHaveBeenCalled();
    }, { timeout: 3000 });
  });
});
