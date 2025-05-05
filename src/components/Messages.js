import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  IconButton, 
  TextField, 
  InputAdornment,
  CircularProgress,
  FormControlLabel,
  Switch,
  Button,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { 
  Reply as ReplyIcon, 
  Send as SendIcon, 
  EmojiEmotions as EmojiIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DescriptionIcon from '@mui/icons-material/Description';
import InfoIcon from '@mui/icons-material/Info';
import EmojiPicker from 'emoji-picker-react';
import axios from 'axios';
import { fetchMessages, sendMessage, sendMedia, updateAutoresponse, deleteMessage, getConversationDetail } from '../services/webhookService';
import InfoDrawer from './InfoDrawer';

// Component for rendering images with proxy endpoint
const MessageImage = ({ mediaId, onClick }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Generate direct URL to proxy endpoint
  const imageProxyUrl = `https://chatboot-webhook-cml-production.up.railway.app/api/download-image/${mediaId}`;
  
  // Use mediaId as key to refresh image
  const imageSrc = `${imageProxyUrl}?v=${retryCount}`;
  
  const handleImageLoaded = () => {
    setLoading(false);
    setError(null);
  };
  
  const handleImageError = () => {
    setLoading(false);
    setError('Could not load image');
  };
  
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    setRetryCount(0);
  }, [mediaId]);

  return (
    <Box sx={{ maxWidth: '100%', mt: 1, mb: 1 }}>   
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      
      {error ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Try again
          </Button>
        </Box>
      ) : (
        <img 
          src={imageSrc}
          alt="Message attachment" 
          style={{ 
            maxWidth: '70%',
            maxHeight: '200px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: loading ? 'none' : 'block',
            objectFit: 'contain'
          }}
          onLoad={handleImageLoaded}
          onError={handleImageError}
          onClick={onClick || (() => window.open(imageSrc, '_blank'))}
        />
      )}
    </Box>
  );
};

// Component for rendering documents
const MessageDocument = ({ mediaId, fileName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const documentProxyUrl = `https://chatboot-webhook-cml-production.up.railway.app/api/download-document/${mediaId}`;
  
  const displayFileName = fileName || 'Attached document';
  
  useEffect(() => {
    const checkDocumentAvailability = async () => {
      try {
        setLoading(true);
        await axios.head(`${documentProxyUrl}?v=${retryCount}`);
        setLoading(false);
        setError(null);
      } catch (err) {
        setLoading(false);
        setError('Could not access document');
      }
    };
    
    checkDocumentAvailability();
  }, [documentProxyUrl, retryCount]);
  
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setRetryCount(prev => prev + 1);
  };
  
  const handleOpenDocument = () => {
    window.open(`${documentProxyUrl}?v=${retryCount}`, '_blank');
  };
  
  const handleDownloadDocument = () => {
    const link = document.createElement('a');
    link.href = `${documentProxyUrl}?v=${retryCount}&download=true`;
    link.download = displayFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      p: 1,
      mt: 1, 
      mb: 1,
      bgcolor: 'rgba(0, 0, 0, 0.04)',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '240px'
    }}>
      {loading ? (
        <CircularProgress size={24} sx={{ my: 1 }} />
      ) : error ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, p: 1 }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            width: '100%'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                textAlign: 'center', 
                mb: 1,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {displayFileName}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 1,
              width: '100%',
              justifyContent: 'center'
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                onClick={handleOpenDocument}
                sx={{ flexGrow: 1, maxWidth: '50%' }}
              >
                View
              </Button>
              <Button 
                variant="outlined" 
                color="primary" 
                size="small" 
                onClick={handleDownloadDocument}
                sx={{ flexGrow: 1, maxWidth: '50%' }}
              >
                Download
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

// Image preview component
const ImagePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState('');
  
  useEffect(() => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    return () => {
      reader.abort();
    };
  }, [file]);
  
  return (
    <Box 
      sx={{ 
        mt: 2, 
        mb: 2, 
        position: 'relative',
        display: 'inline-block'
      }}
    >
      <img 
        src={preview} 
        alt="Preview" 
        style={{
          maxWidth: '150px',
          maxHeight: '150px',
          borderRadius: '8px',
          border: '1px solid #ccc'
        }}
      />
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          backgroundColor: 'white',
          '&:hover': { backgroundColor: '#f5f5f5' },
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)'
        }}
        onClick={onRemove}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

const Messages = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [autoresponse, setAutoresponse] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  // Add InfoDrawer state
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const messageRefs = useRef({});
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const documentInputRef = useRef(null);
  const ICON_COLOR = '#0055A4';

  // Add InfoDrawer handlers
  const handleOpenInfoDrawer = () => {
    setInfoDrawerOpen(true);
  };
  
  const handleCloseInfoDrawer = () => {
    setInfoDrawerOpen(false);
  };
  
  const handleMessageClick = (messageId) => {
    setHighlightedMessageId(messageId);
    
    setTimeout(() => {
      if (messageRefs.current[messageId]) {
        const messageElement = messageRefs.current[messageId];
        
        messageElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  // Function to fetch messages
  const fetchMessagesFromApi = async (convId) => {
    try {
      const response = await axios.get(`https://chatboot-webhook-cml-production.up.railway.app/api/messages/${convId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  // Get conversation details (autoresponse)
  useEffect(() => {
    if (conversationId) {
      axios.get(`https://chatboot-webhook-cml-production.up.railway.app/api/conversation-detail/${conversationId}`)
        .then((res) => {
          const conv = res.data;
          setAutoresponse(!!conv.autoresponse);
        })
        .catch((error) => {
          console.error("Error fetching conversation details", error);
        });
    }
  }, [conversationId]);
  
  // Update autoresponse
  const handleAutoresponseToggle = async (e) => {
    const newValue = e.target.checked;
    setAutoresponse(newValue);
    try {
      const response = await axios.put(`https://chatboot-webhook-cml-production.up.railway.app/api/conversations/${conversationId}/autoresponse`, { autoresponse: newValue });
      console.log('Autoresponse updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating autoresponse:', error.response ? error.response.data : error.message);
    }
  };

  // Polling: refresh messages every 5 seconds
  useEffect(() => {
    if (conversationId) {
      let previousMessagesCount = messages.length;
      const interval = setInterval(async () => {
        try {
          const data = await fetchMessagesFromApi(conversationId);
          const sortedMessages = data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
          
          if (sortedMessages.length > previousMessagesCount) {
            const newMessages = sortedMessages.slice(0, sortedMessages.length - previousMessagesCount);
            const newCustomerMessage = newMessages.find(m => m.sender && m.sender !== 'cml');
            if (newCustomerMessage) {
              if (Notification.permission === 'granted') {
                new Notification('New message received', {
                  body: newCustomerMessage.message,
                  icon: '/path/to/icon.png'
                });
              } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    new Notification('New message received', {
                      body: newCustomerMessage.message,
                      icon: '/path/to/icon.png'
                    });
                  }
                });
              }
            }
          }
          
          previousMessagesCount = sortedMessages.length;
          setMessages(sortedMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [conversationId, messages.length]);
  
  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      const getMessages = async () => {
        try {
          const data = await fetchMessagesFromApi(conversationId);
          const sortedMessages = data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
          setMessages(sortedMessages);
          setTimeout(scrollToBottom, 100);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
      getMessages();
    }
    setReplyingTo(null);
    setShowEmojiPicker(false);
    setInputMessage('');
    setSelectedImage(null);
  }, [conversationId]);

  // Function to scroll to most recent messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = 0;
    }
  };

  const handleReply = (messageId) => {
    setReplyingTo(messages.find(m => m.message_id === messageId));
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData) => {
    setInputMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleImageSelection = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleRemoveSelectedImage = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() || selectedImage) {
      setIsSending(true);
      
      try {
        const clientPhone = messages.find(m => m.sender && m.sender !== 'cml')?.sender;
        if (!clientPhone) {
          console.error('No client phone number found in messages.');
          setIsSending(false);
          return;
        }
        
        if (selectedImage) {
          console.log('Sending image:', selectedImage.name);
          
          const formData = new FormData();
          formData.append('file', selectedImage);
          formData.append('to', clientPhone);
          formData.append('conversationId', conversationId);
          formData.append('caption', inputMessage);
          formData.append('sender', 'cml');
          
          await axios.post(
            'https://chatboot-webhook-cml-production.up.railway.app/api/send-media',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
          
          setSelectedImage(null);
          if (imageInputRef.current) {
            imageInputRef.current.value = '';
          }
        } 
        else if (inputMessage.trim()) {
          console.log('Sending text message:', {
            text: inputMessage,
            replyToId: replyingTo?.message_id,
            conversationId
          });
          
          const payload = {
            to: clientPhone,
            conversationId,
            message: inputMessage,
            sender: 'cml'
          };

          await axios.post(
            'https://chatboot-webhook-cml-production.up.railway.app/send-manual-message',
            payload
          );
        }

        const data = await fetchMessagesFromApi(conversationId);
        const sortedMessages = data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
        setMessages(sortedMessages);
        scrollToBottom();
        
        setInputMessage('');
        setReplyingTo(null);
        setShowEmojiPicker(false);
        
      } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
        alert(`Error sending message: ${error.response?.data?.error || 'An error occurred'}`);
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleDeleteMessageRequest = (messageId) => {
    setMessageToDelete(messageId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteMessage = () => {
    if (!messageToDelete) return;
    
    axios.delete(`https://chatboot-webhook-cml-production.up.railway.app/api/delete-message/${messageToDelete}`)
      .then(response => {
        setMessages(prevMessages => 
          prevMessages.filter(msg => msg.message_id.toString() !== messageToDelete.toString())
        );
        alert('Message deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting message:', error);
        alert('Error deleting message: ' + (error.response?.data?.error || error.message));
      })
      .finally(() => {
        setOpenDeleteDialog(false);
        setMessageToDelete(null);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const clientPhone = messages.find(m => m.sender && m.sender !== 'cml')?.sender;
    if (!clientPhone) {
      console.error('No client phone number found');
      alert('Could not find client phone number');
      return;
    }

    setIsSending(true);
    
    try {
      console.log(`Sending document:`, file.name);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('to', clientPhone);
      formData.append('conversationId', conversationId);
      formData.append('caption', '');
      formData.append('sender', 'cml');
      
      const response = await axios.post(
        'https://chatboot-webhook-cml-production.up.railway.app/api/send-media',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const data = await fetchMessagesFromApi(conversationId);
      const sortedMessages = data.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));
      setMessages(sortedMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending document:', error);
      alert(`Error sending document: ${error.response?.data?.error || 'An error occurred'}`);
    } finally {
      setIsSending(false);
      if (documentInputRef.current) {
        documentInputRef.current.value = '';
      }
    }
  };

  const handleOpenImageModal = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setOpenImageModal(true);
  };

  const renderMessageContent = (msg) => {
    switch (msg.message_type) {
      case 'audio':
        return (
          <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
            🎵 Audio message
          </Typography>
        );
      case 'image':
        return (
          <MessageImage 
            mediaId={msg.media_id} 
            onClick={() => handleOpenImageModal(`https://chatboot-webhook-cml-production.up.railway.app/api/download-image/${msg.media_id}`)}
          />
        );
      case 'document':
        return (
          <MessageDocument 
            mediaId={msg.media_id} 
            fileName={"Attached Document"}
          />
        );
      default:
        return <Typography variant="body1" sx={{ fontFamily: 'Montserrat, sans-serif' }}>{msg.message}</Typography>;
    }
  };

  // Extract client name from messages
  const clientName = messages.find(m => m.sender && m.sender !== 'cml')?.sender || conversationId;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f5f7fa',
        boxSizing: 'border-box',
      }}
    >
      {/* Chat header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(5px)',
        }}
      >
        <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
          {clientName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControlLabel 
            control={
              <Switch 
                checked={autoresponse} 
                onChange={handleAutoresponseToggle}
              />
            } 
            label="Auto responses" 
          />
          <Tooltip title="Information">
            <IconButton 
              color="primary" 
              onClick={handleOpenInfoDrawer}
              sx={{ ml: 1 }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Messages list */}
      <List
  ref={messagesContainerRef}
  sx={{
    flex: 1,
    overflowY: 'auto',
    p: 2,
    display: 'flex',
    flexDirection: 'column-reverse',
    width: '100%', // Asegurar que ocupa todo el ancho
    boxSizing: 'border-box', // Incluir padding en el ancho
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#888',
      borderRadius: '3px',
    },
  }}
>
        {messages.length > 0 ? (
          messages.map((msg) => (
<ListItem 
  key={msg.message_id}
  ref={(el) => messageRefs.current[msg.message_id] = el}
  sx={{
    display: 'flex',
    justifyContent: msg.sender === 'cml' ? 'flex-end' : 'flex-start',
    width: '100%',
    padding: '8px',
    boxSizing: 'border-box',
    ...(highlightedMessageId === msg.message_id && {
      animation: 'highlight 2s',
      '@keyframes highlight': {
        '0%': { backgroundColor: 'rgba(0, 85, 164, 0.3)' },
        '100%': { backgroundColor: 'transparent' }
      }
    })
  }}
  disableGutters
>
  <Box
    sx={{
      position: 'relative',
      maxWidth: '70%',
      minWidth: '100px', 
      '&:hover .message-actions': {
        opacity: 1,
      },
    }}
  >
    {/* Botones de acción - CORREGIDO (solo un Box para message-actions) */}
    <Box 
      className="message-actions"
      sx={{
        position: 'absolute',
        right: msg.sender === 'cml' ? 'auto' : '-40px',
        left: msg.sender === 'cml' ? '-40px' : 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.2s',
      }}
    >  
      {/* Reply button */}
      <IconButton
        size="small"
        onClick={() => handleReply(msg.message_id)}
        sx={{
          bgcolor: 'white',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
      >
        <ReplyIcon fontSize="small" />
      </IconButton>
      
      {/* Delete button */}
      <IconButton
        size="small"
        onClick={() => handleDeleteMessageRequest(msg.message_id)}
        sx={{
          bgcolor: 'white',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
    
    {/* Message bubble */}
    <Box
      sx={{
        backgroundColor: msg.sender === 'cml' ? '#0055A4' : '#ffffff',
        color: msg.sender === 'cml' ? '#fff' : 'inherit',
        borderRadius: '20px',
        p: 2,
        wordBreak: 'break-word',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {renderMessageContent(msg)}
      <Typography 
        variant="caption"
        sx={{ 
          display: 'block', 
          textAlign: 'right', 
          mt: 1, 
          opacity: 0.8,
          fontFamily: 'Montserrat, sans-serif'
        }}
      >
        {new Date(msg.sent_at).toLocaleString()}
      </Typography>
    </Box>
  </Box>
</ListItem>
          ))
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              textAlign: 'center', 
              mt: 2,
              fontFamily: 'Montserrat, sans-serif'
            }}
          >
            No messages found.
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </List>

      {/* Image modal */}
      <Modal
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        aria-labelledby="image-modal"
        aria-describedby="full-size-image-view"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <IconButton 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8,
              bgcolor: 'rgba(255,255,255,0.7)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
            }}
            onClick={() => setOpenImageModal(false)}
          >
            <CloseIcon />
          </IconButton>
          <img 
            src={modalImageSrc} 
            alt="Full size" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: 'calc(90vh - 100px)',
              objectFit: 'contain' 
            }} 
          />
        </Box>
      </Modal>

      {/* Loading indicator */}
      {isSending && (
        <Box sx={{ position: 'absolute', bottom: '80px', right: '20px' }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Reply UI */}
      {replyingTo && (
        <Box
          sx={{
            p: 2,
            bgcolor: '#f0f2f5',
            borderTop: '1px solid #ccc',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              Replying to:
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setReplyingTo(null)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Box
            sx={{
              pl: 2,
              borderLeft: `4px solid ${ICON_COLOR}`,
            }}
          >
            <Typography variant="body2" noWrap sx={{ fontFamily: 'Montserrat, sans-serif' }}>
              {replyingTo.message}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Image preview */}
      {selectedImage && (
        <Box sx={{ p: 1, borderTop: '1px solid #ccc', textAlign: 'center' }}>
          <ImagePreview file={selectedImage} onRemove={handleRemoveSelectedImage} />
        </Box>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <Box
          sx={{
            position: 'absolute',
            bottom: selectedImage ? '160px' : '80px',
            left: '20px',
            zIndex: 1,
            boxShadow: 3,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            lazyLoadEmojis={true}
            searchPlaceholder="Search emoji..."
          />
        </Box>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        style={{ display: 'none' }}
        onChange={handleImageSelection}
      />
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        ref={documentInputRef}
        style={{ display: 'none' }}
        onChange={handleDocumentUpload}
      />

      {/* Message input */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #ccc',
          backgroundColor: 'white',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              backgroundColor: '#f0f2f5',
              fontFamily: 'Montserrat, sans-serif',
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    sx={{ 
                      color: ICON_COLOR,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 85, 164, 0.04)'
                      }
                    }}
                  >
                    <EmojiIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => imageInputRef.current.click()}
                    sx={{ 
                      color: ICON_COLOR,
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 85, 164, 0.04)'
                      }
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => documentInputRef.current.click()}
                    sx={{ 
                      color: ICON_COLOR,
                      ml: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 85, 164, 0.04)'
                      }
                    }}
                  >
                    <DescriptionIcon />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton 
                  onClick={handleSendMessage}
                  disabled={isSending}
                  sx={{ 
                    color: ICON_COLOR,
                    opacity: (inputMessage.trim() || selectedImage) ? 1 : 0.7,
                    '&:hover': {
                      backgroundColor: 'rgba(0, 85, 164, 0.04)'
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this message?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will only delete your version of the message. 
            The original message will still exist for other users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmDeleteMessage} 
            sx={{
              color: 'white', 
              backgroundColor: '#d32f2f', 
              '&:hover': {backgroundColor: '#b71c1c'},
            }} 
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* InfoDrawer component */}
      <InfoDrawer 
        open={infoDrawerOpen} 
        onClose={handleCloseInfoDrawer} 
        conversationId={conversationId}
        onMessageClick={handleMessageClick}
      />
    </Box>
  );
};

export default Messages;