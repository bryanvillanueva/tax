import React, { useState, useEffect, useRef } from "react";
import { 
  CssBaseline,
  Box, 
  Container,
  Typography,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  Alert,
  Snackbar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "./CustomDrawer";
import CustomSpeedDial from "./CustomSpeedDial";
import CustomAppBar from "./CustomAppBar";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area
} from "recharts";
import axios from "axios";

// API URL base - usamos la URL de Railway
const API_BASE_URL = 'https://taxbackend-production.up.railway.app';

const UsersModule = () => {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const COLORS = ["#0858e6", "#00C49F", "#8884d8", "#FF8042", "#A83279"];
  const PRODUCT_PRICES = {
    "Ultimate": 899,
    "Bronze": 8.99,
    "Software Creator": 0
  };

  // Referencia para el contenedor del gráfico
  const chartRef = useRef(null);

  // Detectar si la pantalla es móvil
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Efecto para detectar scroll para mostrar la barra de búsqueda en el AppBar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      const shouldShowSearch = scrollPosition > 100; // Mostrar después de 100px de scroll      
      if (shouldShowSearch !== showSearch) {
        setShowSearch(shouldShowSearch);
      }
    };
    
    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', scrollListener, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, [showSearch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        
        // Obtener datos del usuario actual
        try {
          const userResponse = await axios.get(
            `${API_BASE_URL}/user`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setUserData(userResponse.data);
          console.log("Datos de usuario obtenidos correctamente:", userResponse.data);
          
          // No validamos el rol para evitar restricciones innecesarias
        } catch (userError) {
          console.error("Error obteniendo datos del usuario:", userError);
          showErrorMessage("No se pudo obtener la información del usuario. Utilizando datos simulados.");
          
          // Datos simulados para el usuario
          setUserData({
            first_name: "Usuario",
            last_name: "Demo",
            email: "usuario@ejemplo.com",
            role: "admin"
          });
        }

        try {
          // Intenta obtener estadísticas de usuarios
          const statsResponse = await axios.get(
            `${API_BASE_URL}/users/stats`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("Datos de estadísticas obtenidos:", statsResponse.data);
          
          // Establecer estadísticas
          setTotalUsers(statsResponse.data.totalUsers || 0);
          setProductStats(statsResponse.data.productStats || []);
          setRevenueData(statsResponse.data.revenueData || []);
        } catch (statsError) {
          console.error("Error obteniendo estadísticas:", statsError);
          showErrorMessage("No se pudieron cargar las estadísticas. Generando datos en tiempo real.");
          
          try {
            // Si el endpoint /users/stats falla, intentamos generar estadísticas a partir de los usuarios
            const usersResponse = await axios.get(
              `${API_BASE_URL}/users`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const userData = usersResponse.data;
            
            // Generar productStats a partir de los datos de usuarios
            const productCounts = {};
            userData.forEach(user => {
              const product = user.product || 'Unknown';
              productCounts[product] = (productCounts[product] || 0) + 1;
            });
            
            const generatedProductStats = Object.entries(productCounts).map(([name, value]) => ({
              name,
              value
            }));
            
            setUsers(userData);
            setFilteredUsers(userData);
            setProductStats(generatedProductStats);
            setTotalUsers(userData.length);
            
            // Generar datos de ingresos mensuales simulados
            // Agrupar usuarios por mes usando created_at
            const usersByMonth = {};
            const now = new Date();
            const months = [];
            
            // Generar los últimos 6 meses
            for (let i = 5; i >= 0; i--) {
              const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const monthName = date.toLocaleString('en-US', { month: 'short' });
              months.push(monthName);
              usersByMonth[monthName] = { total: 0, Ultimate: 0, Bronze: 0 };
            }
            
            // Contar usuarios por mes
            userData.forEach(user => {
              if (user.created_at) {
                const date = new Date(user.created_at);
                const monthName = date.toLocaleString('en-US', { month: 'short' });
                
                if (usersByMonth[monthName]) {
                  usersByMonth[monthName].total++;
                  if (user.product === 'Ultimate') usersByMonth[monthName].Ultimate++;
                  if (user.product === 'Bronze') usersByMonth[monthName].Bronze++;
                }
              }
            });
            
            // Crear datos de ingresos acumulativos
            let ultimateTotal = 0;
            let bronzeTotal = 0;
            
            const generatedRevenueData = months.map(month => {
              // Acumular usuarios para este mes
              ultimateTotal += usersByMonth[month].Ultimate;
              bronzeTotal += usersByMonth[month].Bronze;
              
              // Calcular ingresos
              const ultimateRevenue = ultimateTotal * PRODUCT_PRICES['Ultimate'];
              const bronzeRevenue = bronzeTotal * PRODUCT_PRICES['Bronze'];
              
              return {
                month,
                'Ultimate Users': ultimateTotal,
                'Bronze Users': bronzeTotal,
                'Ultimate Revenue': ultimateRevenue,
                'Bronze Revenue': bronzeRevenue,
                'Total Revenue': ultimateRevenue + bronzeRevenue
              };
            });
            
            setRevenueData(generatedRevenueData);
            console.log("Datos generados automáticamente de /users");
            return; // Salimos de este bloque ya que ya tenemos todos los datos
            
          } catch (secondError) {
            console.error("Error secundario obteniendo usuarios:", secondError);
              // Si también falla, usamos datos totalmente simulados
            showErrorMessage("Error al generar datos. Usando valores simulados");
            
            // Si falla, usar datos simulados para las estadísticas
            setProductStats([
              { name: 'Ultimate', value: 5 },
              { name: 'Bronze', value: 10 },
              { name: 'Software Creator', value: 3 }
            ]);
            setTotalUsers(18);
            
            // Datos simulados para ingresos
            const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
            const simulatedRevenueData = months.map((month, index) => ({
              month,
              'Ultimate Users': 5 + index,
              'Bronze Users': 10 + (index * 2),
              'Ultimate Revenue': (5 + index) * 899,
              'Bronze Revenue': (10 + (index * 2)) * 8.99,
              'Total Revenue': ((5 + index) * 899) + ((10 + (index * 2)) * 8.99)
            }));
            setRevenueData(simulatedRevenueData);
          }
        }

        // Al llegar aquí, ya tenemos datos de usuarios si el bloque anterior tuvo éxito
        // Solo intentamos obtener la lista de usuarios si no la tenemos aún
        if (users.length === 0) {
          try {
            // Obtener lista de usuarios
            const usersResponse = await axios.get(
              `${API_BASE_URL}/users`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Datos de usuarios obtenidos:", usersResponse.data);
            
            // Establecer datos de usuarios
            const userData = usersResponse.data;
            setUsers(userData);
            setFilteredUsers(userData);
          } catch (usersError) {
            console.error("Error obteniendo usuarios:", usersError);
            showErrorMessage("No se pudo cargar la lista de usuarios. Mostrando datos simulados.");
            
            // Usar datos simulados si falla
            const simulatedUsers = [
              { user_id: 1, first_name: 'Admin', last_name: 'User', email: 'admin@example.com', product: 'Ultimate', company_name: 'Admin Co', phone: '123-456-7890', created_at: '2023-01-01' },
              { user_id: 2, first_name: 'Test', last_name: 'User', email: 'test@example.com', product: 'Bronze', company_name: 'Test Co', phone: '987-654-3210', created_at: '2023-02-15' },
              { user_id: 3, first_name: 'Demo', last_name: 'User', email: 'demo@example.com', product: 'Software Creator', company_name: 'Demo Co', phone: '555-555-5555', created_at: '2023-03-20' }
            ];
            setUsers(simulatedUsers);
            setFilteredUsers(simulatedUsers);
          }
        }
      } catch (error) {
        console.error("Error general:", error);
        
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
          showErrorMessage(`Error del servidor: ${error.response.status} - ${error.response.data.message || 'Error desconocido'}`);
        } else if (error.request) {
          console.error("Error request:", error.request);
          showErrorMessage("No se pudo conectar con el servidor. Compruebe su conexión.");
        } else {
          showErrorMessage(`Error: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Calcular totales de ingresos
  const calculateRevenueTotals = () => {
    const lastMonth = revenueData.length > 0 ? revenueData[revenueData.length - 1] : {};
    const totalRevenue = lastMonth['Total Revenue'] || 0;
    const ultimateRevenue = lastMonth['Ultimate Revenue'] || 0;
    const bronzeRevenue = lastMonth['Bronze Revenue'] || 0;
    
    return {
      totalRevenue: totalRevenue,
      ultimateRevenue: ultimateRevenue,
      bronzeRevenue: bronzeRevenue,
      ultimatePercentage: totalRevenue > 0 ? (ultimateRevenue / totalRevenue) * 100 : 0,
      bronzePercentage: totalRevenue > 0 ? (bronzeRevenue / totalRevenue) * 100 : 0
    };
  };

  const revenueTotals = calculateRevenueTotals();

  const ultimateCount = productStats.find(item => item.name === 'Ultimate')?.value || 0;
  const bronzeCount = productStats.find(item => item.name === 'Bronze')?.value || 0;
  const softwareCreatorCount = productStats.find(item => item.name === 'Software Creator')?.value || 0;

  // Calcular totales de ingresos basados en todos los usuarios (no solo datos mensuales)
  const calculateUserBasedRevenue = () => {
    // Calcular ingresos basados en precios fijos
    const ultimateRevenue = ultimateCount * PRODUCT_PRICES['Ultimate'];
    const bronzeRevenue = bronzeCount * PRODUCT_PRICES['Bronze'];
    const totalRevenue = ultimateRevenue + bronzeRevenue;
    
    return {
      totalRevenue,
      ultimateRevenue,
      bronzeRevenue,
      ultimatePercentage: totalRevenue > 0 ? (ultimateRevenue / totalRevenue) * 100 : 0,
      bronzePercentage: totalRevenue > 0 ? (bronzeRevenue / totalRevenue) * 100 : 0
    };
  };

  // Ingresos basados en usuarios actuales
  const userBasedRevenue = calculateUserBasedRevenue();

  useEffect(() => {
    let updatedUsers = users.filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (productFilter) {
      updatedUsers = updatedUsers.filter((user) => user.product === productFilter);
    }

    setFilteredUsers(updatedUsers);
  }, [searchTerm, productFilter, users]);

  const handleFilterChange = (product) => {
    setProductFilter(productFilter === product ? "" : product);
  };

  // Formatear números con separador de miles
  const formatNumber = (num) => {
    return (num || 0).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  // Formatear moneda
  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Cargando datos del dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="warning" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* AppBar mejorado */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          zIndex: 1300,
          height: '70px',
        }}
      >
        <Toolbar>
          <CustomAppBar
            userData={userData}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            showSearch={showSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </Toolbar>
      </AppBar>

      {/* Drawer component */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />

      {/* Contenido principal con fondo degradado */}
      <Box
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
          minHeight: '100vh',
          pt: { xs: 10, sm: 12 },
          pb: 8,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Container maxWidth="lg">
          {/* Logo con animación suave */}
          <Box 
            sx={{ 
              textAlign: 'center',
              my: 4, 
              position: 'relative',
              zIndex: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}
          >
            <img
              src="https://tax.bryanglen.com/logo.png"
              alt="Logo"
              style={{ 
                maxWidth: isMobile ? '180px' : '200px',
                filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))'
              }}
            />
          </Box>
          
          {/* Título de página */}
          <Typography 
            variant="h4" 
            align="center"
            sx={{ 
              mb: 4, 
              fontWeight: 700,
              background: 'linear-gradient(90deg, #0858e6 0%, #4481eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
              fontFamily: 'Montserrat, sans-serif',
            }}
          >
            Admin Dashboard
          </Typography>

          {/* Tabs para navegación */}
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: '12px', 
              overflow: 'hidden',
              mb: 4,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                backgroundColor: '#fff',
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0858e6',
                  height: 3
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '16px',
                  py: 2,
                  color: 'rgba(0, 0, 0, 0.6)',
                  '&.Mui-selected': {
                    color: '#0858e6'
                  }
                }
              }}
            >
              <Tab label="Overview" icon={<TrendingUpIcon />} iconPosition="start" />
              <Tab label="User Statistics" icon={<GroupsIcon />} iconPosition="start" />
              <Tab label="Revenue Analysis" icon={<AttachMoneyIcon />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Panel de estadísticas destacadas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Total de usuarios */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(8, 88, 230, 0.1)', color: '#0858e6', mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Total Users
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                    {formatNumber(totalUsers)}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Ultimate
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatNumber(ultimateCount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Bronze
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatNumber(bronzeCount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Ingresos mensuales */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(0, 196, 159, 0.1)', color: '#00C49F', mr: 2 }}>
                      <AttachMoneyIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Monthly Revenue
                    </Typography>
                  </Box>
                  <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                    {formatCurrency(userBasedRevenue.totalRevenue)}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Ultimate
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatCurrency(userBasedRevenue.ultimateRevenue)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Bronze
                      </Typography>
                      <Typography variant="body1" fontWeight="600">
                        {formatCurrency(userBasedRevenue.bronzeRevenue)}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Ultimate Revenue */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(136, 132, 216, 0.1)', color: '#8884d8', mr: 2 }}>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Ultimate Plan
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h3" fontWeight="700" sx={{ mr: 1 }}>
                      {formatNumber(ultimateCount)}
                    </Typography>
                    <Chip 
                      label={`$${PRODUCT_PRICES.Ultimate}`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(136, 132, 216, 0.1)', 
                        color: '#8884d8',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {formatCurrency(userBasedRevenue.ultimateRevenue)} revenue
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {userBasedRevenue.ultimatePercentage.toFixed(1)}% of total revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Bronze Revenue */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255, 128, 66, 0.1)', color: '#FF8042', mr: 2 }}>
                      <AccountBalanceWalletIcon />
                    </Avatar>
                    <Typography variant="h6" fontWeight="600" color="text.secondary">
                      Bronze Plan
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                    <Typography variant="h3" fontWeight="700" sx={{ mr: 1 }}>
                      {formatNumber(bronzeCount)}
                    </Typography>
                    <Chip 
                      label={`$${PRODUCT_PRICES.Bronze}`}
                      size="small"
                      sx={{ 
                        bgcolor: 'rgba(255, 128, 66, 0.1)', 
                        color: '#FF8042',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {formatCurrency(userBasedRevenue.bronzeRevenue)} revenue
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {userBasedRevenue.bronzePercentage.toFixed(1)}% of total revenue
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            </Grid>

          {/* Contenido con tabs */}
          {tabValue === 0 ? (
            <Grid container spacing={4}>
              {/* Distribución de usuarios */}

{/* Distribución de usuarios - Versión mejorada */}
<Grid item xs={12} md={6} lg={5}>
  <Paper 
    elevation={0} 
    sx={{ 
      p: 3, 
      borderRadius: '16px', 
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      height: '100%'
    }}
  >
    <Typography variant="h6" fontWeight="600" gutterBottom>
      User Distribution
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? 250 : 300, mt: 2 }}>
      {/* Gráfico de pastel */}
      <Box sx={{ flexGrow: 1, height: '70%' }} ref={chartRef}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={productStats}
              cx="50%"
              cy="50%"
              innerRadius={isMobile ? 40 : 60}
              outerRadius={isMobile ? 70 : 90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              onClick={(data) => handleFilterChange(data.name)}
            >
              {productStats.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  opacity={productFilter && productFilter !== entry.name ? 0.4 : 1}
                  stroke="#fff"
                  strokeWidth={2} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [formatNumber(value), name]}
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: 'none',
                padding: '10px 14px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      {/* Leyenda personalizada separada debajo del gráfico */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
        {productStats.map((item, index) => (
          <Box
            key={index}
            onClick={() => handleFilterChange(item.name)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '4px 10px',
              borderRadius: '16px',
              cursor: 'pointer',
              backgroundColor: productFilter === item.name ? `${COLORS[index % COLORS.length]}20` : 'transparent',
              border: `1px solid ${COLORS[index % COLORS.length]}`,
              opacity: productFilter && productFilter !== item.name ? 0.6 : 1,
              transition: 'all 0.2s ease',
              '&:hover': { 
                backgroundColor: `${COLORS[index % COLORS.length]}20`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: COLORS[index % COLORS.length],
                mr: 1
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: productFilter === item.name ? COLORS[index % COLORS.length] : 'text.primary',
                fontWeight: productFilter === item.name ? 600 : 400
              }}
            >
              {item.name} ({formatNumber(item.value)})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Paper>
</Grid>

              {/* Estadísticas de crecimiento */}
              <Grid item xs={12} md={6} lg={7}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Monthly User Growth
                  </Typography>
                  <Box sx={{ height: isMobile ? 250 : 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={revenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name) => [formatNumber(value), name]}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            padding: '10px 14px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="Ultimate Users" 
                          name="Ultimate Users"
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.3} 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="Bronze Users" 
                          name="Bronze Users"
                          stroke="#FF8042" 
                          fill="#FF8042" 
                          fillOpacity={0.3} 
                          strokeWidth={2}
                          activeDot={{ r: 6 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Datos de ingresos */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Monthly Revenue Breakdown
                  </Typography>
                  <Box sx={{ height: 350, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" padding={{ left: 20, right: 20 }} />
                        <YAxis 
                          tickFormatter={(value) => `${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${formatNumber(value)}`, 'Revenue']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            padding: '10px 14px'
                          }}
                        />
                        <Legend />
                        <Bar 
                          dataKey="Ultimate Revenue" 
                          name="Ultimate Plan Revenue" 
                          fill="#8884d8" 
                          barSize={isMobile ? 20 : 40} 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="Bronze Revenue" 
                          name="Bronze Plan Revenue" 
                          fill="#FF8042" 
                          barSize={isMobile ? 20 : 40} 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
          ) : tabValue === 1 ? (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="600">
                      Users Database
                    </Typography>
                    <Box sx={{ maxWidth: '300px', width: '100%' }}>
                      <TextField
                        fullWidth
                        placeholder="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            backgroundColor: '#f9f9f9',
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                            '& fieldset': {
                              borderColor: 'transparent',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#0858e6',
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <TableContainer component={Box} sx={{ overflowX: 'auto', maxHeight: '60vh' }}>
                    <Table sx={{ minWidth: 750 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>Company</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              Plan
                              <IconButton size="small" onClick={() => setProductFilter("") }>
                                <Chip 
                                  label="All"
                                  size="small"
                                  variant={productFilter === "" ? "filled" : "outlined"}
                                  clickable
                                  sx={{ 
                                    ml: 1,
                                    fontWeight: 'medium',
                                    backgroundColor: productFilter === "" ? '#0858e6' : 'transparent',
                                    color: productFilter === "" ? 'white' : 'inherit',
                                    '&:hover': {
                                      backgroundColor: productFilter === "" ? '#0746b0' : 'rgba(0, 0, 0, 0.08)'
                                    }
                                  }} 
                                />
                              </IconButton>
                              {productStats.map(({ name }) => (
                                <IconButton key={name} size="small" onClick={() => handleFilterChange(name)}>
                                  <Chip 
                                    label={name}
                                    size="small"
                                    variant={productFilter === name ? "filled" : "outlined"}
                                    clickable
                                    sx={{ 
                                      fontWeight: 'medium',
                                      backgroundColor: productFilter === name ? '#0858e6' : 'transparent',
                                      color: productFilter === name ? 'white' : 'inherit',
                                      '&:hover': {
                                        backgroundColor: productFilter === name ? '#0746b0' : 'rgba(0, 0, 0, 0.08)'
                                      }
                                    }} 
                                  />
                                </IconButton>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>Phone</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>Registration Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredUsers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              <Typography variant="body1" sx={{ my: 4, color: 'text.secondary' }}>
                                No users found matching your search criteria.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredUsers.map((user, index) => (
                            <TableRow 
                              key={`${user.email}-${index}`}
                              sx={{ 
                                '&:hover': { backgroundColor: '#f5f9ff' },
                                borderLeft: user.product === 'Ultimate' 
                                  ? '4px solid #8884d8' 
                                  : user.product === 'Bronze' 
                                    ? '4px solid #FF8042'
                                    : '4px solid transparent'
                              }}
                            >
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar 
                                    sx={{ 
                                      width: 36, 
                                      height: 36, 
                                      mr: 2,
                                      bgcolor: user.product === 'Ultimate' 
                                        ? 'rgba(136, 132, 216, 0.1)' 
                                        : user.product === 'Bronze' 
                                          ? 'rgba(255, 128, 66, 0.1)'
                                          : 'rgba(0, 0, 0, 0.1)',
                                      color: user.product === 'Ultimate' 
                                        ? '#8884d8' 
                                        : user.product === 'Bronze' 
                                          ? '#FF8042'
                                          : '#666'
                                    }}
                                  >
                                    {user.first_name?.charAt(0) || '?'}{user.last_name?.charAt(0) || '?'}
                                  </Avatar>
                                  <Typography variant="body1">
                                    {user.first_name || 'Unknown'} {user.last_name || ''}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{user.email || '-'}</TableCell>
                              <TableCell>{user.company_name || '-'}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={user.product || 'Unknown'}
                                  size="small"
                                  sx={{ 
                                    fontWeight: 'medium',
                                    backgroundColor: user.product === 'Ultimate' 
                                      ? 'rgba(136, 132, 216, 0.1)' 
                                      : user.product === 'Bronze' 
                                        ? 'rgba(255, 128, 66, 0.1)'
                                        : 'rgba(0, 0, 0, 0.1)',
                                    color: user.product === 'Ultimate' 
                                      ? '#8884d8' 
                                      : user.product === 'Bronze' 
                                        ? '#FF8042'
                                        : '#666'
                                  }} 
                                />
                              </TableCell>
                              <TableCell>{user.phone || '-'}</TableCell>
                              <TableCell>{formatDate(user.created_at)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={4}>
              {/* Estadísticas de ingresos */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Monthly Revenue Trends
                  </Typography>
                  <Box sx={{ height: isMobile ? 300 : 400, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueData}
                        margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" />
                        <YAxis 
                          tickFormatter={(value) => `${value >= 1000 ? `${(value/1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${formatNumber(value)}`, 'Revenue']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            padding: '10px 14px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="Ultimate Revenue" 
                          name="Ultimate Plan" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Bronze Revenue" 
                          name="Bronze Plan" 
                          stroke="#FF8042" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={3}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Total Revenue" 
                          name="Total Revenue" 
                          stroke="#0858e6" 
                          activeDot={{ r: 8 }} 
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Proyección financiera */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Revenue by Product Type
                  </Typography>
                  <Box sx={{ height: isMobile ? 300 : 400, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Ultimate Plan', value: userBasedRevenue.ultimateRevenue },
                            { name: 'Bronze Plan', value: userBasedRevenue.bronzeRevenue }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={isMobile ? 60 : 80}
                          outerRadius={isMobile ? 90 : 120}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                          labelLine={false}
                        >
                          <Cell fill="#8884d8" stroke="#fff" strokeWidth={2} />
                          <Cell fill="#FF8042" stroke="#fff" strokeWidth={2} />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${formatNumber(value)}`, 'Revenue']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            padding: '10px 14px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Resumen de ingresos */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Revenue Summary
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={4}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(8, 88, 230, 0.03)',
                          border: '1px solid rgba(8, 88, 230, 0.1)'
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Total Monthly Revenue
                        </Typography>
                        <Typography variant="h4" fontWeight="700" color="#0858e6" sx={{ mb: 1 }}>
                          {formatCurrency(userBasedRevenue.totalRevenue)}
                        </Typography>
                        <Typography variant="body2">
                          Based on {formatNumber(ultimateCount + bronzeCount)} active subscribers
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(136, 132, 216, 0.03)',
                          border: '1px solid rgba(136, 132, 216, 0.1)'
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Ultimate Plan Revenue
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography variant="h4" fontWeight="700" color="#8884d8" sx={{ mb: 1 }}>
                            {formatCurrency(userBasedRevenue.ultimateRevenue)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({userBasedRevenue.ultimatePercentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formatNumber(ultimateCount)} subscribers × ${PRODUCT_PRICES.Ultimate}/license
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3,
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 128, 66, 0.03)',
                          border: '1px solid rgba(255, 128, 66, 0.1)'
                        }}
                      >
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          Bronze Plan Revenue
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                          <Typography variant="h4" fontWeight="700" color="#FF8042" sx={{ mb: 1 }}>
                            {formatCurrency(userBasedRevenue.bronzeRevenue)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({userBasedRevenue.bronzePercentage.toFixed(1)}%)
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formatNumber(bronzeCount)} subscribers × ${PRODUCT_PRICES.Bronze}/mo
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>

        <CustomSpeedDial />
      </Box>
    </>
  );
};

export default UsersModule;