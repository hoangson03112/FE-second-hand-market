import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, Paper, Typography, TextField, IconButton, Avatar, 
  List, ListItem, ListItemText, ListItemAvatar, Divider, Badge
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../../../contexts/AuthContext';
import chatService from '../../../services/chatService';
import { formatDate } from '../../../utils/helpers';
import './ChatBox.css';

/**
 * Component hiển thị hộp chat
 * 
 * @param {Boolean} isOpen - Trạng thái hiển thị của hộp chat
 * @param {Function} onClose - Hàm xử lý khi đóng hộp chat
 * @param {Object} recipient - Thông tin người nhận
 */
const ChatBox = ({ isOpen, onClose, recipient }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const socket = chatService.getSocket();

  // Sample data - replace with actual API calls
  useEffect(() => {
    if (isOpen) {
      // Simulate loading messages from API
      setMessages([
        { id: 1, text: 'Hi there!', sender: 'them', timestamp: new Date(Date.now() - 100000) },
        { id: 2, text: 'I\'m interested in your product.', sender: 'me', timestamp: new Date(Date.now() - 80000) },
        { id: 3, text: 'Great! Do you have any questions?', sender: 'them', timestamp: new Date(Date.now() - 60000) }
      ]);
    }
  }, [isOpen]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: Date.now(),
      text: newMessage,
      sender: 'me',
      timestamp: new Date()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Here you would also send the message to your backend API
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <Paper className="chat-box-container">
      <Box className="chat-box-header">
        <Box className="user-info">
          <ListItemAvatar>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
              color="success"
            >
              <Avatar src={recipient?.avatar} alt={recipient?.name}>
                {recipient?.name?.charAt(0) || 'U'}
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <Typography variant="h6" className="username">
            {recipient?.name || 'Người dùng'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} className="close-button">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message-bubble ${message.sender === 'me' ? 'sent' : 'received'}`}
          >
            <div className="message-text">{message.text}</div>
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      <form className="message-input-container" onSubmit={handleSendMessage}>
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
          className="message-input"
        />
        <IconButton 
          color="primary" 
          type="submit"
          className="send-button"
        >
          <SendIcon />
        </IconButton>
      </form>
    </Paper>
  );
};

export default ChatBox; 