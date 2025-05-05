import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider, 
  Badge,
  TextField,
  InputAdornment,
  IconButton,
  Container,
  Paper,
  AppBar,
  Toolbar,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchConversations } from '../services/webhookService';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import CustomAppBar from './CustomAppBar';
import CustomDrawer from './CustomDrawer';
import Messages from './Messages';
import CustomSpeedDial from "./CustomSpeedDial";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [selectedConversationName, setSelectedConversationName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  // Verificar autenticación y cargar datos de usuario
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get('https://taxbackend-production.up.railway.app/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error al validar el token:', error);
        localStorage.removeItem('authToken');
        navigate('/');
      }
    };

    validateToken();
  }, [navigate]);

  // Cargar conversaciones
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://chatboot-webhook-cml-production.up.railway.app/api/conversations');
        setConversations(response.data);
        setFilteredConversations(response.data);
      } catch (error) {
        console.error('Error al obtener conversaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Filtrar conversaciones cuando cambia la búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredConversations(conversations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = conversations.filter(conv => {
      if (conv.client_name && conv.client_name.toLowerCase().includes(query)) {
        return true;
      }
      if (conv.phone_number && conv.phone_number.includes(query)) {
        return true;
      }
      if (conv.last_message && conv.last_message.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });

    setFilteredConversations(filtered);
  }, [searchQuery, conversations]);

  const handleSelectConversation = (conversationId, clientName) => {
    setSelectedConversationId(conversationId);
    setSelectedConversationName(clientName || 'Sin nombre');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredConversations(conversations);
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation.last_message_type) {
      return conversation.last_message || 'Sin mensajes';
    }
    
    switch (conversation.last_message_type) {
      case 'audio':
        return 'Mensaje de voz';
      case 'image':
        return 'Archivo de imagen';
      case 'document':
        return 'Documento adjunto';
      default:
        return conversation.last_message || 'Sin mensajes';
    }
  };

  return (
    <>
      <CssBaseline />
      
      {/* AppBar */}
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
          />
        </Toolbar>
      </AppBar>
      
      {/* Drawer */}
      <CustomDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        userData={userData}
      />

      {/* Contenido principal */}
      <Box 
        sx={{ 
          backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #eef1f5 100%)',
          minHeight: '100vh',
          pt: '90px',
          pb: 4,
          px: { xs: 1, sm: 2, md: 4 }
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#0055A4',
              mb: 3,
              fontFamily: 'Montserrat, sans-serif',
              textAlign: 'center'
            }}
          >
            Chat Support
          </Typography>

          <Paper
            elevation={0}
            sx={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              backgroundColor: '#fff',
              height: 'calc(100vh - 200px)',
              display: 'flex'
            }}
          >
            {/* Lista de conversaciones */}
            <Box
              sx={{
                width: '300px',
                borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa'
              }}
            >
              {/* Barra de búsqueda */}
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#0055A4' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleClearSearch}
                          edge="end"
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: '12px',
                      bgcolor: '#fff',
                      fontFamily: 'Montserrat, sans-serif',
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                      },
                      '&:hover fieldset': {
                        borderColor: '#0055A4',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0055A4',
                      }
                    }
                  }}
                />
              </Box>
              
              {/* Lista de chats */}
              <List
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '3px',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <React.Fragment key={conv.conversation_id}>
                      <ListItem
                        button
                        onClick={() => handleSelectConversation(conv.conversation_id, conv.client_name)}
                        sx={{
                          backgroundColor: selectedConversationId === conv.conversation_id ? 'rgba(0, 85, 164, 0.08)' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 85, 164, 0.04)',
                          },
                          transition: 'background 0.2s ease-in-out',
                          padding: '12px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        <ListItemAvatar>
                          <Badge
                            variant="dot"
                            color="primary"
                            invisible={!conv.last_message_sender || conv.last_message_sender === 'Sharky'}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                          >
                            <Avatar sx={{ bgcolor: '#0055A4' }}>
                              {conv.client_name ? conv.client_name.charAt(0) : '?'}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                              {conv.client_name || 'Sin nombre'}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '160px',
                                color: conv.last_message_sender && conv.last_message_sender !== 'Sharky' ? '#0055A4' : 'inherit',
                                fontFamily: 'Montserrat, sans-serif',
                              }}
                            >
                              {getLastMessagePreview(conv)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                      No conversations found
                    </Typography>
                  </Box>
                )}
              </List>
            </Box>

            {/* Área de mensajes */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                bgcolor: 'white',
              }}
            >
              {selectedConversationId ? (
                <Messages conversationId={selectedConversationId} />
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" color="textSecondary" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Select a conversation to view messages
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
        <CustomSpeedDial />
      </Box>
    </>
  );
};

export default Chat;