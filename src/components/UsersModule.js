import React, { useState, useEffect, useRef } from "react";
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
  useTheme,
  useMediaQuery,
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

  // Referencia para el contenedor del gráfico
  const chartRef = useRef(null);

  // Detectar si la pantalla es móvil
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Efecto para detectar clics fuera del gráfico
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic no fue dentro del gráfico, limpia la selección
      if (chartRef.current && !chartRef.current.contains(event.target)) {
        setProductFilter("");
      }
    };

    // Agrega el event listener al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");

        const userResponse = await axios.get(
          "https://taxbackend-production.up.railway.app/user",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(userResponse.data);

        if (!["admin", "developer"].includes(userResponse.data.role)) {
          navigate("/");
          return;
        }

        const usersResponse = await axios.get(
          "https://taxbackend-production.up.railway.app/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
        setTotalUsers(usersResponse.data.length);

        const productCounts = usersResponse.data.reduce((acc, user) => {
          acc[user.product] = (acc[user.product] || 0) + 1;
          return acc;
        }, {});

        const productChartData = Object.entries(productCounts).map(([product, count]) => ({
          name: product, // Cambiamos "product" a "name" para que funcione con las etiquetas
          value: count,  // Cambiamos "count" a "value" para que funcione con PieChart
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
          "&:focus": {
            outline: "none",
          },
          zIndex: 3, // Asegurar que el botón esté por encima del gráfico
        }}
      >
        <MenuIcon />
      </IconButton>

      <CustomDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} userData={userData} />

      <Container maxWidth="lg" sx={{ backgroundColor: "#fff", borderRadius: "20px", padding: "20px", mt: 4 }}>
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 3, marginBottom: "8%" }}>
          Dashboard Management
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                mb: 2,
                backgroundColor: "#0858e6",
                color: "#fff",
                textAlign: "center",
                padding: "10px",
                "&:focus": {
                  outline: "none",
                },
                userSelect: "none",
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

            {productStats.map(({ name, value }, index) => (
              <Card
                key={name}
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  border: productFilter === name ? `2px solid ${COLORS[index % COLORS.length]}` : "1px solid #ddd",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  "&:focus": {
                    outline: "none",
                  },
                  color: COLORS[index % COLORS.length],
                  transition: "all 0.2s ease-in-out",
                  userSelect: "none",
                }}
                onClick={() => handleFilterChange(name)}
              >
                <CardContent>
                  <Typography variant="h7" sx={{ color: COLORS[index % COLORS.length] }}>
                    {name}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={8} ref={chartRef}>
            <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
              Users per Product
            </Typography>
            <ResponsiveContainer
              width="100%"
              height={isMobile ? 400 : 700} // Reducir la altura en móviles
              style={{ zIndex: 2 }}
            >
              <PieChart>
                <Pie
                  data={productStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false} // Desactivamos la línea
                  outerRadius={isMobile ? 120 : 220} // Reducir el radio en móviles
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  onClick={(data) => handleFilterChange(data.name)}
                  isAnimationActive={false}
                  activeShape={null}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.55; // Más afuera del gráfico
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    const labelRadius = outerRadius + (isMobile ? 10 : 30); // Más separación del gráfico
                    const labelX = cx + labelRadius * Math.cos(-midAngle * RADIAN);
                    const labelY = cy + labelRadius * Math.sin(-midAngle * RADIAN);

                    // Determinar si la sección está seleccionada
                    const isSelected = productFilter === productStats[index].name;

                    return (
                      <g>
                        {/* Nombre del sector más separado */}
                        <text
                          x={labelX}
                          y={labelY}
                          fill={COLORS[index % COLORS.length]}
                          textAnchor={labelX > cx ? "start" : "end"}
                          dominantBaseline="central"
                          style={{
                            pointerEvents: "none",
                            fontSize: isMobile ? "12px" : "15px", // Reducir el tamaño de la fuente en móviles
                            fontWeight: "bold",
                            transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                            opacity: productFilter ? (isSelected ? 1 : 0.4) : 1,
                            transform: isSelected ? "scale(1.01)" : "scale(1)", // Escala si está seleccionado
                          }}
                          tabIndex={-1}
                        >
                          {`${productStats[index].name}`}
                        </text>

                        {/* Porcentaje dentro del gráfico */}
                        <text
                          x={x}
                          y={y}
                          fill="white"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{
                            pointerEvents: "none",
                            fontSize: isMobile ? "12px" : "16px", // Reducir el tamaño de la fuente en móviles
                            transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
                            transform: isSelected ? "scale(1.01)" : "scale(1)", // Escala si está seleccionado
                          }}
                          tabIndex={-1}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      </g>
                    );
                  }}
                >
                  {productStats.map((entry, index) => {
                    // Definir si la escala va hacia adentro (0.98) o hacia afuera (1.02)
                    const isRightSide = Math.cos(-entry.midAngle * (Math.PI / 180)) > 0;
                    const scaleFactor = isRightSide ? 0.98 : 1.02; // Derecha hacia adentro, Izquierda hacia afuera

                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        opacity={productFilter && productFilter !== entry.name ? 0.4 : 1}
                        style={{
                          transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                          transform:
                            productFilter === entry.name
                              ? `scale(${scaleFactor})`
                              : "scale(1)", // Aplica la escala en la dirección correcta
                          filter: productFilter === entry.name
                            ? "drop-shadow(0 0 3px rgba(0, 0, 0, 0.15))"
                            : "none",
                          outline: "none",
                        }}
                      />
                    );
                  })}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, my: 3 }}>
          <TextField
            label="Search User"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:focus-within": {
                  "& > fieldset": {
                    borderColor: "#0858e6",
                  },
                },
              },
            }}
          />
        </Box>

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
                <TableRow
                  key={user.email}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
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