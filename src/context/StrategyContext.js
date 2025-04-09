import React, { createContext, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Crear el contexto
const StrategyContext = createContext();

// Proveedor del contexto
export const StrategyProvider = ({ children }) => {
  const [previousStrategy, setPreviousStrategy] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [qbidValue, setQbidValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Navegar a una estrategia QBID guardando la estrategia actual y sus valores
  const navigateToQbid = (qbidType) => {
    // Crear una copia profunda de los valores para evitar referencias a objetos
    const valuesCopy = JSON.parse(JSON.stringify(formValues));
    
    // Guardar la estrategia actual
    setPreviousStrategy({
      path: location.pathname,
      formValues: valuesCopy,
    });

    // Navegar a la estrategia QBID seleccionada
    navigate(`/form-selector/${qbidType}`);
  };

  // Volver a la estrategia anterior con el valor calculado
  const returnToPreviousStrategy = (calculatedValue) => {
    if (previousStrategy) {
      // Establecer el valor calculado de QBID
      setQbidValue(calculatedValue);
      
      // Crear una copia de previousStrategy para garantizar que se mantiene durante la navegación
      const prevStrategy = { ...previousStrategy };
      
      // Navegar de vuelta a la estrategia anterior
      navigate(prevStrategy.path);
      
      // Importante: No limpiar previousStrategy para mantener los valores del formulario
    }
  };

  // Actualizar formulario de la estrategia
  const updateFormValues = (values) => {
    // Usamos una comparación profunda para evitar actualizaciones innecesarias
    const currentValuesStr = JSON.stringify(formValues);
    const newValuesStr = JSON.stringify(values);
    
    if (currentValuesStr !== newValuesStr) {
      setFormValues(values);
    }
  };

  // Obtener el valor de QBID y limpiarlo (para evitar usos accidentales)
  const getAndClearQbidValue = () => {
    const value = qbidValue;
    setQbidValue(''); // Limpiar después de obtener
    return value;
  };

  return (
    <StrategyContext.Provider
      value={{
        navigateToQbid,
        returnToPreviousStrategy,
        updateFormValues,
        getAndClearQbidValue,
        previousStrategy,
        formValues,
      }}
    >
      {children}
    </StrategyContext.Provider>
  );
};

  // Hook personalizado para usar el contexto
export const useStrategy = () => {
  const context = useContext(StrategyContext);
  if (!context) {
    throw new Error('useStrategy debe ser usado dentro de un StrategyProvider');
  }
  return context;
};
