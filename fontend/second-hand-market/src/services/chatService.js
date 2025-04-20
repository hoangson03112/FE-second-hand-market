import ApiService from './ApiService';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:2000';
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

  getConversations: async (userId) => {
    return await ApiService.get(`/conversations/${userId}`);
  },

  getMessages: async (conversationId) => {
    return await ApiService.get(`/messages/${conversationId}`);
  },

  sendMessage: async (message) => {
    return await ApiService.post('/messages', message);
  },

  createConversation: async (data) => {
    return await ApiService.post('/conversations', data);
  }
};

export default chatService; 