import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  Avatar,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  ImageList,
  ImageListItem,
  Tab,
  Tabs,
  Button,
  Badge,
  Fade,
  Slide,
  Tooltip,
  Card,
  CardContent,
  useMediaQuery,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Person as PersonIcon, 
  Phone as PhoneIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  InsertDriveFile as FileIcon,
  Collections as GalleryIcon,
  Description as DocumentIcon,
  Event as EventIcon,
  RadioButtonChecked as StatusIcon,
  PhotoLibrary as PhotoIcon,
  Download as DownloadIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { alpha, useTheme } from '@mui/material/styles';
import axios from 'axios';

// Component for image thumbnails
const ImageThumbnail = ({ mediaId, onClick }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const imageUrl = `https://chatboot-webhook-cml-production.up.railway.app/api/download-image/${mediaId}`;
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        paddingTop: '100%', // Keep square aspect ratio
        position: 'relative', 
        cursor: 'pointer',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': { 
          transform: 'scale(1.02)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
        }
      }}
      onClick={onClick}
    >
      {loading && (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.04)'
        }}>
          <CircularProgress size={20} thickness={2} />
        </Box>
      )}
      
      {error ? (
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.04)'
        }}>
          <Typography variant="caption" color="error">Error</Typography>
        </Box>
      ) : (
        <img 
          src={imageUrl}
          alt="Media attachment" 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: loading ? 'none' : 'block'
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      )}
    </Box>
  );
};

// Component for document items
const DocumentItem = ({ document, onClick }) => {
  // Function to determine the document icon
  const getDocumentIcon = () => {
    return <DocumentIcon color="primary" />;
  };

  return (
    <Card 
      sx={{ 
        mb: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': { 
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              borderRadius: '8px',
              bgcolor: '#0055A4',
              color: 'white',
              p: 1,
              mr: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getDocumentIcon()}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap fontWeight={500} fontFamily="Montserrat, sans-serif">
              {document.message || "Document"}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5, fontFamily: "Montserrat, sans-serif" }}>
              {formatDate(document.sent_at)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
};

// Text highlighting component
const HighlightedText = ({ text, highlight }) => {
  if (!highlight.trim() || !text) {
    return <Typography variant="body2" fontFamily="Montserrat, sans-serif">{text}</Typography>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <Typography variant="body2" fontFamily="Montserrat, sans-serif">
      {parts.map((part, i) => 
        regex.test(part) ? (
          <Box 
            component="span" 
            key={i} 
            sx={{ 
              backgroundColor: '#0055A4', 
              color: 'white',
              px: 0.5,
              borderRadius: '3px'
            }}
          >
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </Typography>
  );
};

const InfoDrawer = ({ open, onClose, conversationId, onMessageClick }) => {
  const [clientInfo, setClientInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [mediaMessages, setMediaMessages] = useState({ images: [], documents: [] });
  const [sortOrder, setSortOrder] = useState('newest');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && conversationId) {
      fetchClientInfo();
      fetchMessages();
    }
  }, [open, conversationId]);

  // Effect for searching messages
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = messages.filter(msg => 
      msg.message && typeof msg.message === 'string' && 
      msg.message.toLowerCase().includes(query)
    );
    
    // Sort results
    const sortedResults = [...results].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.sent_at) - new Date(a.sent_at);
      } else {
        return new Date(a.sent_at) - new Date(b.sent_at);
      }
    });
    
    setSearchResults(sortedResults);
  }, [searchQuery, messages, sortOrder]);

  // Effect for filtering media
  useEffect(() => {
    if (messages.length > 0) {
      const images = messages.filter(msg => msg.message_type === 'image');
      const documents = messages.filter(msg => msg.message_type === 'document');
      
      // Sort by most recent date
      const sortedImages = [...images].sort((a, b) => 
        new Date(b.sent_at) - new Date(a.sent_at)
      );
      
      const sortedDocuments = [...documents].sort((a, b) => 
        new Date(b.sent_at) - new Date(a.sent_at)
      );
      
      setMediaMessages({ 
        images: sortedImages, 
        documents: sortedDocuments 
      });
    }
  }, [messages]);

  const fetchClientInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get conversation details
      const conversationResponse = await axios.get(`https://chatboot-webhook-cml-production.up.railway.app/api/conversation-detail/${conversationId}`);
      
      // Get messages to extract phone number
      const messagesResponse = await axios.get(`https://chatboot-webhook-cml-production.up.railway.app/api/messages/${conversationId}`);
      
      // Extract phone number (sender that is not "cml")
      const clientPhone = messagesResponse.data.find(m => m.sender && m.sender !== 'cml')?.sender;
      
      setClientInfo({
        name: conversationResponse.data.client_name,
        phone: clientPhone || 'Not available',
        status: conversationResponse.data.status || 'Active',
        createdAt: conversationResponse.data.last_message_at || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching client information:', error);
      setError('Unable to load client information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://chatboot-webhook-cml-production.up.railway.app/api/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageClick = (mediaId) => {
    // Find message corresponding to this image
    const message = messages.find(msg => msg.media_id === mediaId);
    if (message && message.message_id) {
      // Close drawer and scroll to message
      onClose();
      onMessageClick(message.message_id);
    }
  };

  const handleDocumentClick = (mediaId) => {
    // Find message corresponding to this document
    const message = messages.find(msg => msg.media_id === mediaId);
    if (message) {
      // If it has URL, open document in new tab
      if (message.media_url) {
        window.open(message.media_url, '_blank');
      } else if (message.message_id) {
        // If no URL, close drawer and scroll to message
        onClose();
        onMessageClick(message.message_id);
      }
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'newest' ? 'oldest' : 'newest');
  };

  // If not open, render nothing
  if (!open) return null;

  return (
    <Slide 
      direction="left" 
      in={open} 
      mountOnEnter 
      unmountOnExit
    >
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          right: 0,
          width: isSmallScreen ? '100%' : '300px',
          height: '100%',
          zIndex: 1200,
          overflowY: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderTopLeftRadius: isSmallScreen ? 0 : 12,
          borderBottomLeftRadius: isSmallScreen ? 0 : 12,
          borderLeft: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: 'white',
          boxShadow: theme => isSmallScreen ? 'none' : theme.shadows[8],
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(90deg, #0055A4 0%, #4481eb 100%)',
          color: 'white',
          borderTopLeftRadius: isSmallScreen ? 0 : 12,
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
            Chat Information
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            p: 3, 
            gap: 2 
          }}>
            <Skeleton variant="rectangular" width="100%" height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="circular" width={80} height={80} sx={{ mx: 'auto', my: 2 }} />
            <Skeleton variant="text" width="80%" sx={{ mx: 'auto' }} />
            <Skeleton variant="text" width="60%" sx={{ mx: 'auto', mb: 2 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50%' }}>
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => {
                fetchClientInfo();
                fetchMessages();
              }}
              startIcon={<RefreshIcon />}
              sx={{ 
                mt: 2,
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Retry
            </Button>
          </Box>
        ) : clientInfo ? (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Tabs */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minHeight: '60px',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Montserrat, sans-serif',
                  '&.Mui-selected': {
                    color: '#0055A4',
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0055A4',
                  height: 3
                }
              }}
            >
              <Tab 
                icon={<PersonIcon />} 
                label="Profile" 
                id="tab-0"
                aria-controls="tabpanel-0"
              />
              <Tab 
                icon={<GalleryIcon />} 
                label="Media" 
                id="tab-1"
                aria-controls="tabpanel-1"
                iconPosition="start"
              />
              <Tab 
                icon={<SearchIcon />} 
                label="Search" 
                id="tab-2"
                aria-controls="tabpanel-2"
              />
            </Tabs>

            {/* Profile tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 0}
              id="tabpanel-0"
              aria-labelledby="tab-0"
              sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 0, 
                display: tabValue === 0 ? 'block' : 'none',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 85, 164, 0.3)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              {/* Profile card */}
              <Box sx={{ 
                background: 'linear-gradient(135deg, rgba(0, 85, 164, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
                py: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mb: 1
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <Tooltip title={`Status: ${clientInfo.status}`}>
                      <StatusIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: 'success.main',
                          bgcolor: 'white',
                          borderRadius: '50%',
                          padding: '2px'
                        }} 
                      />
                    </Tooltip>
                  }
                >
                  <Avatar
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: '#0055A4',
                      fontSize: '2.5rem',
                      mb: 2,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {clientInfo.name ? clientInfo.name.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                </Badge>
                <Typography variant="h5" sx={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                  {clientInfo.name || "No name"}
                </Typography>
                <Chip 
                  label={clientInfo.status} 
                  size="small" 
                  color="success" 
                  variant="outlined"
                  sx={{ mt: 1 }}
                />
              </Box>
              
              {/* Contact details */}
              <Box sx={{ px: 3 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mb: 2, 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  Contact Details
                </Typography>
                
                <Card sx={{ mb: 2, border: '1px solid rgba(0,0,0,0.08)' }} elevation={0}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      pb: 2, 
                      borderBottom: '1px solid rgba(0,0,0,0.06)'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha('#0055A4', 0.1),
                        color: '#0055A4',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2
                      }}>
                        <PhoneIcon />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                          Phone
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                          {clientInfo.phone}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: alpha('#0055A4', 0.1),
                        color: '#0055A4',
                        borderRadius: '50%',
                        p: 1,
                        mr: 2
                      }}>
                        <EventIcon />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                          Client Since
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                          {formatDate(clientInfo.createdAt).split(' ')[0]}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Statistics */}
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    mt: 3,
                    mb: 2, 
                    color: 'text.secondary',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    fontFamily: 'Montserrat, sans-serif'
                  }}
                >
                  Conversation Statistics
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      py: 2,
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                      }
                    }} elevation={0}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>
                        {messages.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                        Messages
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card sx={{ 
                      textAlign: 'center', 
                      py: 2,
                      border: '1px solid rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                      }
                    }} elevation={0}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 600, fontFamily: 'Montserrat, sans-serif' }}>
                        {mediaMessages.images.length + mediaMessages.documents.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                        Files
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Media tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 1}
              id="tabpanel-1"
              aria-labelledby="tab-1"
              sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                p: 3, 
                display: tabValue === 1 ? 'block' : 'none',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 85, 164, 0.3)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              {/* Images section */}
              <Box sx={{ mb: 4 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PhotoIcon 
                      sx={{ 
                        color: '#0055A4', 
                        mr: 1, 
                        fontSize: '1.2rem' 
                      }} 
                    />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#0055A4',
                        fontFamily: 'Montserrat, sans-serif' 
                      }}
                    >
                      Images ({mediaMessages.images.length})
                    </Typography>
                  </Box>
                  {mediaMessages.images.length > 0 && (
                    <Tooltip title="Download all images">
                      <IconButton size="small" color="primary">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                {mediaMessages.images.length > 0 ? (
                  <ImageList cols={2} gap={8}>
                    {mediaMessages.images.map((image) => (
                      <ImageListItem key={image.media_id}>
                        <ImageThumbnail 
                          mediaId={image.media_id} 
                          onClick={() => handleImageClick(image.media_id)}
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    borderRadius: 2 
                  }}>
                    <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                      No shared images
                    </Typography>
                  </Box>
                )}
              </Box>
              
              {/* Documents section */}
              <Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DocumentIcon 
                      sx={{ 
                        color: '#0055A4', 
                        mr: 1, 
                        fontSize: '1.2rem' 
                      }} 
                    />
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600, 
                        color: '#0055A4',
                        fontFamily: 'Montserrat, sans-serif' 
                      }}
                    >
                      Documents ({mediaMessages.documents.length})
                    </Typography>
                  </Box>
                  {mediaMessages.documents.length > 0 && (
                    <Tooltip title="Download all documents">
                      <IconButton size="small" color="primary">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                
                {mediaMessages.documents.length > 0 ? (
                  <List disablePadding>
                    {mediaMessages.documents.map((doc) => (
                      <DocumentItem 
                        key={doc.media_id} 
                        document={doc}
                        onClick={() => handleDocumentClick(doc.media_id)}
                      />
                    ))}
                  </List>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    textAlign: 'center', 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    borderRadius: 2 
                  }}>
                    <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                      No shared documents
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Search tab */}
            <Box
              role="tabpanel"
              hidden={tabValue !== 2}
              id="tabpanel-2"
              aria-labelledby="tab-2"
              sx={{ 
                flex: 1, 
                display: 'flex',
                flexDirection: 'column',
                p: 0, 
                display: tabValue === 2 ? 'flex' : 'none'
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search in conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: '#0055A4' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={handleClearSearch}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 2,
                      bgcolor: 'rgba(0,0,0,0.04)',
                      '&.Mui-focused': {
                        boxShadow: `0 0 0 2px ${alpha('#0055A4', 0.2)}`
                      },
                      '& fieldset': {
                        borderColor: 'transparent',
                      },
                      '&:hover fieldset': {
                        borderColor: alpha('#0055A4', 0.3),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0055A4',
                      },
                      fontFamily: 'Montserrat, sans-serif'
                    }
                  }}
                />
              </Box>
              
              {/* Sort results */}
              {searchResults.length > 0 && (
                <Box sx={{ 
                  px: 2, 
                  py: 1, 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                    {searchResults.length} results
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small"
                    color="primary"
                    onClick={toggleSortOrder}
                    startIcon={sortOrder === 'newest' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
                    sx={{ textTransform: 'none', fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {sortOrder === 'newest' ? 'Most recent' : 'Oldest'}
                  </Button>
                </Box>
              )}
              
              {/* Search results */}
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto',
                p: 2,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(0, 85, 164, 0.3)',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                },
              }}>
                {searchResults.length > 0 ? (
                  <List disablePadding>
                    {searchResults.map((msg, index) => (
                      <Fade in={true} timeout={300} style={{ transitionDelay: `${index * 50}ms` }} key={msg.message_id || index}>
                        <ListItem sx={{ 
                          mb: 1.5, 
                          p: 0,
                          display: 'block'
                        }}
                        >
                          <Card
                            elevation={0}
                            onClick={() => {
                              onMessageClick(msg.message_id);
                              onClose();
                            }}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: '1px solid rgba(0,0,0,0.08)',
                              borderRadius: 2,
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              mb: 1
                            }}>
                              <Typography variant="caption" color="text.secondary" fontFamily="Montserrat, sans-serif">
                                {formatDate(msg.sent_at)}
                              </Typography>
                              <Chip 
                                label={msg.sender === 'cml' ? 'You' : 'Client'} 
                                size="small"
                                color={msg.sender === 'cml' ? 'primary' : 'default'}
                                sx={{ 
                                  height: 20, 
                                  fontSize: '0.65rem',
                                  fontWeight: 500,
                                  fontFamily: 'Montserrat, sans-serif'
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ mt: 1 }}>
                              <HighlightedText 
                                text={msg.message} 
                                highlight={searchQuery} 
                              />
                            </Box>
                          </Card>
                        </ListItem>
                      </Fade>
                    ))}
                  </List>
                ) : searchQuery ? (
                  <Box sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '80%',
                    textAlign: 'center'
                  }}>
                    <SearchIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                      No results found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                      No messages contain "<strong>{searchQuery}</strong>"
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '80%',
                    textAlign: 'center'
                  }}>
                    <SearchIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500, fontFamily: 'Montserrat, sans-serif' }}>
                      Search conversation
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontFamily="Montserrat, sans-serif">
                      Enter text to search messages in this conversation
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography fontFamily="Montserrat, sans-serif">No information available</Typography>
          </Box>
        )}
      </Paper>
    </Slide>
  );
};

export default InfoDrawer;