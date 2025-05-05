import axios from 'axios';

const API_BASE_URL = 'https://chatboot-webhook-cml-production.up.railway.app';

export const fetchConversations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/conversations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchMessages = async (conversationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async (payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/send-manual-message`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const sendMedia = async (formData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/send-media`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending media:', error);
    throw error;
  }
};

export const updateAutoresponse = async (conversationId, autoresponse) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/conversations/${conversationId}/autoresponse`,
      { autoresponse }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating autoresponse:', error);
    throw error;
  }
};

export const deleteMessage = async (messageId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/delete-message/${messageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
};

export const getConversationDetail = async (conversationId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/conversation-detail/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting conversation detail:', error);
    throw error;
  }
};