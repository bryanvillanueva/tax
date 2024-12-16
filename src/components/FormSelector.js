import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardContent, TextField, Container } from '@mui/material';

const forms = [
  { id: 'depreciation', title: 'Depreciation Form', description: 'Calculate accelerated depreciation (Section 179 and Bonus).' },
  { id: 'augusta', title: 'Augusta Rule Form', description: 'Calculate deductions under the Augusta Rule.' },
  { id: 'prepaid', title: 'Prepaid Expenses Form', description: 'Manage and calculate prepaid expenses deductions.' },
  { id: 'hireKids', title: 'Hire Your Kids', description: 'Hire Your Kids Form' },
];

const FormSelector = ({ onSelectForm }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ mt: 5 }}>
      <Container
        sx={{
          backgroundImage: 'url(https://wac-cdn.atlassian.com/misc-assets/webp-images/bg_atl_cloud_hero_small.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '12px',
          padding: '32px',
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#fff', fontWeight: 'bold' }}>
          Search or Select a Form to Continue
        </Typography>

        <TextField
          fullWidth
          placeholder="Search for a form..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            '& fieldset': { border: 'none' },
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': { borderColor: '#9ce7ff' },
              '&.Mui-focused fieldset': { borderColor: '#30C2F3' },
            },
          }}
        />
      </Container>

      <Grid container spacing={2}>
        {filteredForms.map((form) => (
          <Grid item xs={12} sm={6} md={3} key={form.id}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: '12px' }}>
              <CardActionArea onClick={() => onSelectForm(form.id)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <img
                    src="https://wac-cdn.atlassian.com/misc-assets/webp-images/confluence/templates/taxonomy/strategic-plan.svg"
                    alt="Form Icon"
                    style={{ width: '230px', marginBottom: '18px' }}
                  />
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#0858e6', mb: 1 }}>
                    {form.title}
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
