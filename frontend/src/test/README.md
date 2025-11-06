# 🧪 Configuración de Tests con Vitest

Esta carpeta contiene la configuración global y utilidades para los tests del proyecto.

## 📁 Estructura

```
src/test/
├── setup.js           # Configuración global de Vitest
├── mocks/             # Mocks globales (próximamente)
└── utils/             # Utilidades de testing (próximamente)
```

## 📝 Archivos

### `setup.js`
Configuración global que se ejecuta antes de cada suite de tests.
- Importa `@testing-library/jest-dom` para matchers adicionales del DOM
- Se configura en `vite.config.js` bajo `test.setupFiles`

## 🚀 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo UI
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage
```

## 📚 Documentación

- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
