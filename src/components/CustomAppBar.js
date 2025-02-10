import React, { useState } from "react";
import { Typography, Avatar, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ userData }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Abre el menú en la posición del clic
  };

  const handleClose = () => {
    setAnchorEl(null); // Cierra el menú
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

  return (
    <>
      <Box
        onClick={handleClick} // Manejar el clic para abrir el menú
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "flex",
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, #0858e6 0%, #0055A4 100%)",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          color: "white",
          zIndex: 3,
          cursor: "pointer",
          "@media (max-width: 800px)": {
            padding: "0px",
            borderRadius: "50%",
            background: "none",
          },
        }}
      >
        {userData && (
          <>
            <Typography
              variant="body1"
              sx={{
                mr: 2,
                fontWeight: "bold",
                "@media (max-width: 800px)": {
                  display: "none",
                },
              }}
            >
              {`${userData.first_name} ${userData.last_name}`}
            </Typography>
            <Avatar
              alt={userData.first_name}
              src={userData.profilePicture || "https://tax.bryanglen.com/user.png"}
              sx={{
                "@media (max-width: 600px)": {
                  width: 48,
                  height: 48,
                },
              }}
            />
          </>
        )}
      </Box>

      {/* Menú desplegable */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ mt: 1 }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default UserProfile;
