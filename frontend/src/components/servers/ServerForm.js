import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Función helper para validar IPv4
const validateIPv4 = (value) => {
  if (!value) return false;

  const parts = value.split('.');
  if (parts.length !== 4) return false;

  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
};

// Esquema de validación con Yup
const validationSchema = Yup.object({
  name: Yup.string()
    .required('El nombre es requerido')
    .min(3, 'Mínimo 3 caracteres'),
  description: Yup.string()
    .max(200, 'Máximo 200 caracteres'),
  host: Yup.string()
    .required('El host es requerido'),
  ip_address: Yup.string()
    .required('La IP es requerida')
    .test('valid-ipv4', 'IP inválida (debe ser IPv4 válida)', validateIPv4)
    .test('ip-range', 'Cada octeto debe estar entre 0-255', (value) => {
      if (!value) return true;
      const parts = value.split('.');
      if (parts.length !== 4) return false;
      return parts.every(part => {
        const num = parseInt(part, 10);
        if (isNaN(num)) return false;
        if (num < 0 || num > 255) return false;
        // Verificar que no tenga ceros a la izquierda (excepto el 0 solo)
        if (part !== '0' && part.startsWith('0')) return false;
        return true;
      });
    })
});

function ServerForm({ server, onSubmit, onCancel }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (server && server.image_url) {
      setImagePreview(server.image_url);
    }
  }, [server]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Vista previa básica
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Agregar la imagen al envío
      const formData = {
        ...values,
        image: imageFile
      };
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
        {server ? 'Editar Servidor' : 'Nuevo Servidor'}
      </h2>

        <Formik
          enableReinitialize={true}
          initialValues={{
            name: server?.name || '',
            description: server?.description || '',
            host: server?.host || '',
            ip_address: server?.ip_address || ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, values }) => (
            <Form className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <Field
                  name="name"
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                    errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Servidor Principal"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <small className="text-gray-500">(opcional)</small>
                </label>
                <Field
                  name="description"
                  as="textarea"
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Descripción del servidor..."
                />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  {values.description.length}/200
                </p>
              </div>

              {/* Host e IP en la misma fila */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Host */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Host <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="host"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                      errors.host && touched.host ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="ejemplo.com"
                  />
                  {errors.host && touched.host && (
                    <p className="text-red-500 text-xs mt-1">{errors.host}</p>
                  )}
                </div>

                {/* IP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección IP <span className="text-red-500">*</span>
                  </label>
                  <Field
                    name="ip_address"
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-700 ${
                      errors.ip_address && touched.ip_address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="192.168.1.1"
                  />
                  {errors.ip_address && touched.ip_address && (
                    <p className="text-red-500 text-xs mt-1">{errors.ip_address}</p>
                  )}
                </div>
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen <small className="text-gray-500">(300x300 recomendado)</small>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 hover:border-blue-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      Seleccionar imagen
                    </span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-3 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center" style={{ minHeight: '200px' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 mt-6 border-t">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {server ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    server ? 'Actualizar' : 'Guardar'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
    </div>
  );
}

export default ServerForm;