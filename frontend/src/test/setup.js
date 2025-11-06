/**
 * Configuración global de tests para Vitest
 *
 * @testing-library/jest-dom añade matchers personalizados para assertions del DOM
 * Permite hacer cosas como:
 * - expect(element).toHaveTextContent(/react/i)
 * - expect(element).toBeInTheDocument()
 *
 * Más información: https://github.com/testing-library/jest-dom
 */
import '@testing-library/jest-dom';
