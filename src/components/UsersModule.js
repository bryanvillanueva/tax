import React, { useState, useEffect } from "react";
import {
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
  IconButton,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "./CustomDrawer";
import CustomSpeedDial from "./CustomSpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from "axios";

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
  const navigate = useNavigate();

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A83279"];

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        // Obtener usuario autenticado
        const userResponse = await axios.get(
          "https://taxbackend-production.up.railway.app/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userResponse.data);

        if (!["admin", "developer"].includes(userResponse.data.role)) {
          navigate("/");
          return;
        }

        // Obtener lista de usuarios
        const usersResponse = await axios.get(
          "https://taxbackend-production.up.railway.app/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
        setTotalUsers(usersResponse.data.length);

        // Calcular la cantidad de usuarios por cada producto
        const productCounts = usersResponse.data.reduce((acc, user) => {
          acc[user.product] = (acc[user.product] || 0) + 1;
          return acc;
        }, {});

        // Convertir datos a formato de gráfico
        const productChartData = Object.entries(productCounts).map(([product, count]) => ({
          product,
          count,
        }));

        setProductStats(productChartData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Filtrar usuarios por búsqueda y producto seleccionado
  useEffect(() => {
    let updatedUsers = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (productFilter) {
      updatedUsers = updatedUsers.filter((user) => user.product === productFilter);
    }

    setFilteredUsers(updatedUsers);
  }, [searchTerm, productFilter, users]);

  // Manejar clic en los números o en el gráfico de pastel
  const handleFilterChange = (product) => {
    setProductFilter(productFilter === product ? "" : product);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Botón del Drawer */}
      <IconButton
        size="large"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          color: "#fff",
          backgroundColor: "#0858e6",
          transition: "transform 0.2s, background-color 0.2s",
          "&:hover": {
            backgroundColor: "#0746b0",
            transform: "scale(1.1)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} userData={userData} />

      {/* Contenedor principal */}
      <Container maxWidth="lg" sx={{ backgroundColor: "#fff", borderRadius: "20px", padding: "20px", mt: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 3, marginBottom: "8%" }}> 
          Dashboard Management
        </Typography>

        <Grid container spacing={3}>
          {/* Información de usuarios por producto */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                mb: 2,
                backgroundColor: "#0858e6",
                color: "#fff",
                textAlign: "center",
                padding: "10px",
              }}
              onClick={() => handleFilterChange("")}
            >
              <CardContent>
                <Typography variant="h6">Total Users</Typography>
                <Typography variant="h4" fontWeight="bold">
                  {totalUsers}
                </Typography>
              </CardContent>
            </Card>

            {productStats.map(({ product, count }, index) => (
            <Card
            key={product}
            sx={{
              mb: 2,
              cursor: "pointer",
              border: productFilter === product ? "2px solid #0858e6" : "1px solid #ddd",
              "&:hover": { backgroundColor: "#f5f5f5" },
              color: COLORS[productStats.findIndex((p) => p.product === product) % COLORS.length], // Color igual al del gráfico
            }}
            onClick={() => handleFilterChange(product)}
          >
           <CardContent>
            <Typography variant="h7" sx={{ color: COLORS[index % COLORS.length] }}> {/* 🔹 Aplica el color del gráfico */}
            {product}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
            {count}
           </Typography>
           </CardContent>
           </Card>
 ))}
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
              Users per Product
            </Typography>
            <ResponsiveContainer width="100%" height={700}>
              <PieChart>
              <Pie
  data={productStats}
  cx="50%"
  cy="50%"
  labelLine={false}
  outerRadius={220}
  fill="#8884d8"
  dataKey="count"
  nameKey="product"
  onClick={(data) => handleFilterChange(data.product)}
  isAnimationActive={false} // Elimina la animación que podría causar bordes
  activeShape={null} // ✅ Elimina el contorno negro al hacer clic
  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // ✅ Muestra nombres y porcentaje
>
  {productStats.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS[index % COLORS.length]}
      opacity={productFilter && productFilter !== entry.product ? 0.4 : 1}
      style={{ transition: "opacity 0.3s ease-in-out" }}
    />
  ))}
</Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        {/* Barra de búsqueda */}
        <Box sx={{ display: "flex", gap: 2, my: 3 }}>
          <TextField
            label="Search User"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        {/* Tabla de usuarios */}
        <TableContainer component={Paper} sx={{ borderRadius: "10px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#0858e6" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}>Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Email</TableCell>
                <TableCell sx={{ color: "#fff" }}>Company Name</TableCell>
                <TableCell sx={{ color: "#fff" }}>Product</TableCell>
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.first_name} {user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.company_name}</TableCell>
                  <TableCell>{user.product}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <CustomSpeedDial />
    </>
  );
};

export default UsersModule;
