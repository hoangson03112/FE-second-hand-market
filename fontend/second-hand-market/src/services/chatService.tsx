import ApiService from './ApiService';
import API_CONFIG from '../config/api.config';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_API_URL || API_CONFIG.BASE_URL;
let socket = null;

const chatService = {
  initSocket: (token) => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token
        }
      });
    }
    return socket;
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => {
    return socket;
  },

  // Updated to match BE routes
  getConversations: async () => {
    return await ApiService.get('/chat/conversations');
  },

  findOrCreateWithProduct: async (productId) => {
    return await ApiService.post('/chat/conversations/findOrCreateWithProduct', { productId });
  },

  findOrCreateWithOrder: async (orderId) => {
    return await ApiService.post('/chat/conversations/findOrCreateWithOrder', { orderId });
  },

  getOptimizedConversation: async (partnerId) => {
    return await ApiService.get(`/chat/optimized/messages/${partnerId}`);
  },

  sendMessage: async (messageData) => {
    return await ApiService.post('/chat/optimized/send', messageData);
  },

  uploadAndSendMessage: async (formData) => {
    return await ApiService.post('/chat/upload-and-send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getAIMessages: async () => {
    return await ApiService.get('/chat/ai/messages');
  },

  // Legacy methods (for backward compatibility)
  getMessages: async (conversationId) => {
    return await ApiService.get(`/chat/messages/${conversationId}`);
  },

  createConversation: async (data) => {
    return await ApiService.post('/chat/conversations', data);
  }
};

export default chatService; 