import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomDrawer from "./CustomDrawer";
import CustomSpeedDial from "./CustomSpeedDial";
import MenuIcon from "@mui/icons-material/Menu";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://taxbackend-production.up.railway.app/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserData(response.data);

        if (!["admin", "developer"].includes(response.data.role)) {
          navigate("/");
        }

        const usersResponse = await axios.get(
          "https://taxbackend-production.up.railway.app/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);
        setTotalUsers(usersResponse.data.length);

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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProductFilterChange = (event) => {
    setProductFilter(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <Typography variant="h4" textAlign="center" fontWeight="bold" sx={{ mb: 3 }}>
          Dashboard Management
        </Typography>

        {/* Total de usuarios activos con gráfico */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography variant="h6" sx={{ color: "#0858e6", mb: 1 }}>
            Total Active Users
          </Typography>
          <Box sx={{ position: "relative", width: 150, height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={15} data={[{ name: "Users", uv: totalUsers, fill: "#0858e6" }]}>
                <RadialBar minAngle={15} background clockWise dataKey="uv" />
              </RadialBarChart>
            </ResponsiveContainer>
            <Typography
              variant="h4"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontWeight: "bold",
              }}
            >
              {totalUsers}
            </Typography>
          </Box>
        </Box>

        {/* Barra de búsqueda y filtro */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search User"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <TextField
            select
            label="Filter by Product"
            variant="outlined"
            fullWidth
            value={productFilter}
            onChange={handleProductFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Bronze Package">Bronze Package</MenuItem>
            <MenuItem value="Silver Package">Silver Package</MenuItem>
            <MenuItem value="Gold Package">Gold Package</MenuItem>
            <MenuItem value="Platinum Package">Platinum Package</MenuItem>
          </TextField>
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
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
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
