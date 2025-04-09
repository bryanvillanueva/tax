import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, MenuItem, Alert, Grid } from '@mui/material';
import QbidFieldWithOptions from './QbidFieldWithOptions';
import { useStrategy } from '../context/StrategyContext';

// PLANTILLA: Usa este archivo como referencia para implementar en otras estrategias
const StrategyFormTemplate = ({ onCalculate }) => {
  // 1. Usar el hook de estrategia para acceder a los valores previos
  const { previousStrategy } = useStrategy();
  
  // 2. Definir todos los estados del formulario
  const [field1, setField1] = useState('');
  const [field2, setField2] = useState('');
  // ... más estados
  const [QBID, setQbid] = useState('');
  const [error, setError] = useState(null);

  // 3. Efecto para restaurar valores cuando regresamos de QBID
  useEffect(() => {
    // Solo restaurar si hay valores previos y solo una vez
    if (previousStrategy && previousStrategy.formValues) {
      const values = previousStrategy.formValues;
      
      // Verificar si los valores son diferentes antes de actualizar para evitar bucles
      if (values.field1 && values.field1 !== field1) {
        setField1(values.field1);
      }
      if (values.field2 && values.field2 !== field2) {
        setField2(values.field2);
      }
      // ... verificar otros campos de manera similar
      
      // NO verificamos QBID aquí, ya que se maneja automáticamente en QbidFieldWithOptions
    }
  }, [previousStrategy]); // IMPORTANTE: NO incluir los estados como dependencias

  // 4. Función de cálculo y validación
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!field1) {
      setError('Field 1 is required.');
      return;
    }

    setError(null);

    // Cálculos y resultados
    const results = {
      // Incluir todos los campos y resultados
      field1,
      field2,
      // ... otros campos
      QBID: parseFloat(QBID) || 0,
    };

    // Pasar resultados al componente padre
    onCalculate(results);
  };

  return (
    <Container>
      <Box sx={{ position: 'relative', mt: 5 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Campos del formulario */}
            <Grid item xs={12} md={6}>
              {/* Campo 1 */}
              <TextField
                label="Field 1"
                fullWidth
                value={field1}
                onChange={(e) => setField1(e.target.value)}
                margin="normal"
              />
              
              {/* Más campos */}
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Campo 2 */}
              <TextField
                label="Field 2"
                fullWidth
                value={field2}
                onChange={(e) => setField2(e.target.value)}
                margin="normal"
              />
              
              {/* Más campos */}
              
              {/* 5. Campo QBID con opciones - IMPORTANTE */}
              <QbidFieldWithOptions 
                value={QBID}
                onChange={setQbid}
                formValues={{
                  // IMPORTANTE: Incluir TODOS los campos del formulario
                  field1,
                  field2,
                  // ... otros campos
                  QBID
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Button type="submit" variant="contained" sx={{backgroundColor:'#0858e6', color: '#fff'}}>
              Calculate
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default StrategyFormTemplate;