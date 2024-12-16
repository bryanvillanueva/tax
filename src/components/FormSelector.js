import React from 'react';
import { Box, Card, CardActionArea, CardContent, Typography, Grid } from '@mui/material';

const FormSelector = ({ onSelectForm }) => {
  const forms = [
    { id: 'depreciation', name: 'Depreciation Form', description: 'Manage depreciation calculations for assets.' },
    { id: 'augusta', name: 'Augusta Rule Form', description: 'Calculate deductions based on the Augusta Rule.' },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {forms.map((form) => (
          <Grid item xs={12} sm={6} md={4} key={form.id}>
            <Card>
              <CardActionArea onClick={() => onSelectForm(form.id)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {form.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FormSelector;
