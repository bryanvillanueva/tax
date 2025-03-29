import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Avatar, 
  Box, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  Divider,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Zoom,
  Slide,
  AppBar,
  Toolbar
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

const CustomAppBar = ({ userData, showSearch, searchTerm, setSearchTerm, drawerOpen, setDrawerOpen }) => {
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isFormSelector = location.pathname === '/form-selector';
  
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    handleClose();
  };

  if (!userData) {
    return null;
  }

  const getInitials = () => {
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name.charAt(0)}${userData.last_name.charAt(0)}`;
    }
    return 'U';
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        zIndex: 1100,
        height: '70px',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 3 }}>
        {/* Left section - Menu button */}
        <Box sx={{ width: '33%', display: 'flex', justifyContent: 'center' }}>
          <IconButton
            onClick={handleDrawerToggle}
            edge="start"
            aria-label="menu"
            sx={{ 
              color: '#0858e6',
              transition: 'color 0.2s',
              '&:hover': {
                color: '#0746b0',
                backgroundColor: 'rgba(8, 88, 230, 0.08)'
              }
            }}
          >
            <MenuIcon sx={{ fontSize: '24px' }} />
          </IconButton>
        </Box>
        
        {/* Center section - Search functionality */}
        <Box sx={{ width: '33%', display: 'flex', justifyContent: 'center' }}>
          {isFormSelector && showSearch && (
            <Slide direction="down" in={showSearch} mountOnEnter unmountOnExit>
              <TextField
                placeholder="Search for a form..."
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#0858e6' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    height: '40px',
                    borderRadius: '20px',
                    backgroundColor: '#fff',
                  }
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0858e6',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0858e6',
                    },
                  },
                }}
              />
            </Slide>
          )}
        </Box>
        
        {/* Right section - User profile */}
        <Box sx={{ width: '33%', display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              }
            }}
          >
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: "rgba(8, 88, 230, 0.1)",
                color: "#0858e6",
                fontWeight: "bold",
                fontSize: "1rem"
              }}
            >
              {getInitials()}
            </Avatar>
            
            {!isMobile && (
              <Box sx={{ ml: 1.5, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "#333",
                    lineHeight: 1.2
                  }}
                >
                  {`${userData.first_name} ${userData.last_name}`}
                </Typography>
                
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(0, 0, 0, 0.6)",
                    fontSize: "0.75rem",
                    mt: 0.2
                  }}
                >
                  {userData.product || "Usuario"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '12px',
            minWidth: 180,
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
            mt: 1.5,
            '& .MuiMenuItem-root': {
              fontSize: '0.95rem',
              py: 1.5,
              px: 2.5,
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(8, 88, 230, 0.05)',
              }
            },
            '& .MuiListItemIcon-root': {
              minWidth: 36,
              color: '#0858e6',
            },
          }
        }}
      >
        <Box sx={{ px: 3, py: 1.5, textAlign: 'center' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            {`${userData.first_name} ${userData.last_name}`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.85rem' }}>
            {userData.email}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonOutlineIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default CustomAppBar;