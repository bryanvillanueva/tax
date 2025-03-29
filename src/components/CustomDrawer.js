import React from "react";
import {
  Box,
  Drawer,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  CircularProgress
} from "@mui/material";

// Iconos
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HelpIcon from "@mui/icons-material/Help";
// Importación de SettingsIcon eliminada ya que no se usa

import { useNavigate } from "react-router-dom";

const CustomDrawer = ({ drawerOpen, setDrawerOpen, userData }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  // Función para cerrar el drawer
  const handleClose = () => {
    setDrawerOpen(false);
  };

  // Lista de menús con sus íconos correspondientes
  const menuItems = [
    { label: "Profile", icon: <PersonIcon />, path: "/profile" },
    { label: "Dashboard", icon: <DashboardIcon />, path: "/form-selector" },
    { label: "Favorites", icon: <FavoriteIcon />, path: "/favorites" },
    { label: "Shop", icon: <ShoppingCartIcon />, path: "https://store.cmltaxplanning.com", external: true },
    { label: "Support", icon: <HelpIcon />, path: "/support" },
  ];

  // Verificar si el usuario tiene rol de admin o developer
  const isAdmin = userData && ["admin", "developer"].includes(userData.role);

  return (
    <Drawer 
      anchor="left" 
      open={drawerOpen} 
      onClose={handleClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: isMobile ? '85%' : 280,
          boxSizing: 'border-box',
          borderRight: 'none',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {/* Botón para cerrar el drawer (visible solo en móviles) */}
        {isMobile && (
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        {/* Header con logo y título */}
        <Box 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold', 
              color: '#0055A4',
              fontFamily: 'Montserrat, sans-serif',
              my: 1,
            }}
          >
            TAX PLANNING
          </Typography>
        </Box>

        {/* Información del usuario */}
        <Box sx={{ p: 3 }}>
          {userData ? (
            <Box sx={{ textAlign: "center" }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Online">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#4caf50',
                        border: '2px solid white',
                      }}
                    />
                  </Tooltip>
                }
              >
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: "auto", 
                    mb: 2,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    border: '3px solid white',
                    bgcolor: '#0055A4',
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {userData.first_name && userData.last_name ? 
                    `${userData.first_name[0]}${userData.last_name[0]}` : 
                    (userData.first_name ? userData.first_name[0] : 'U')}
                </Avatar>
              </Badge>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: "600", 
                  fontFamily: "Montserrat, sans-serif",
                  color: "#333",
                  mb: 0.5,
                }}
              >
                {`${userData.first_name} ${userData.last_name}`}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                {userData.email}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'inline-block',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '12px',
                  backgroundColor: isAdmin ? 'rgba(25, 118, 210, 0.1)' : 'rgba(76, 175, 80, 0.1)',
                  color: isAdmin ? '#1976d2' : '#4caf50',
                  fontWeight: 'medium',
                  textTransform: 'capitalize',
                }}
              >
                {userData.role}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress size={30} />
              <Typography sx={{ mt: 2 }}>Loading...</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ mx: 2, mb: 2 }} />

        {/* Menú de navegación */}
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.label}
              onClick={() => {
                if (item.external) {
                  window.open(item.path, "_blank");
                } else {
                  navigate(item.path);
                  handleClose();
                }
              }}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 85, 164, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#0055A4' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
          ))}

          {/* Admin Panel (visible solo para admin/developer) */}
          {isAdmin && (
            <ListItem
              button
              onClick={() => {
                navigate("/usersModule");
                handleClose();
              }}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                cursor: 'pointer',
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.15)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#d32f2f' }}>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Admin Panel" 
                primaryTypographyProps={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 500,
                }}
              />
            </ListItem>
          )}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Espaciador */}
        <Box sx={{ flexGrow: 1, minHeight: 20 }} />

        <Divider sx={{ mx: 2, my: 1 }} />

        {/* Botón de logout */}
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            fullWidth
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              py: 1.2,
              textTransform: 'none',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 500,
              boxShadow: '0 2px 6px rgba(0, 85, 164, 0.25)',
              '&:hover': {
                boxShadow: '0 4px 10px rgba(0, 85, 164, 0.35)',
              }
            }}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CustomDrawer;