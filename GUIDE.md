# Triển khai hệ thống chat với lưu trữ text trong Database và media trên Cloudinary

Hệ thống chat được triển khai với hai loại lưu trữ khác nhau:
- **Text**: Lưu trữ trực tiếp trong MongoDB
- **Media (hình ảnh, video)**: Lưu trữ trên Cloudinary, chỉ lưu URL về media trong MongoDB

## 1. Cài đặt các thư viện cần thiết

### Frontend
```bash
npm install cloudinary-react socket.io-client
```

### Backend
```bash
npm install cloudinary socket.io express mongoose cors dotenv
```

## 2. Thiết lập Cloudinary

1. Đăng ký tài khoản tại [Cloudinary](https://cloudinary.com/)
2. Tạo một upload preset (có thể là unsigned upload preset)
3. Lấy thông tin cloud name, API key và API secret

## 3. Cấu hình môi trường

Tạo file `.env` trong thư mục backend:

```
MONGODB_URI=mongodb://localhost:27017/second-hand-market
PORT=2000
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 4. Cấu trúc codebase

### Backend
- **Models**: Sử dụng MessageModel.js để định nghĩa schema cho tin nhắn
- **Controllers**: Sử dụng MessageController.js để xử lý logic của việc lưu trữ và lấy tin nhắn
- **Socket**: Sử dụng socketHandler.js để xử lý các sự kiện real-time
- **Routes**: Sử dụng chatRoutes.js để định nghĩa API endpoints

### Frontend
- **Components**: Sử dụng ChatBox.js để hiển thị giao diện chat
- **Services**: Sử dụng các services để gọi API và xử lý logic

## 5. Luồng dữ liệu

### Khi gửi tin nhắn có file đính kèm

1. **Frontend**:
   - Người dùng chọn file từ thiết bị
   - Trước khi gửi tin nhắn, file được upload lên Cloudinary
   - Sau khi upload thành công, URL và public_id được lưu trữ
   - Tin nhắn được gửi qua socket.io với nội dung text và URLs của files

2. **Backend**:
   - Nhận tin nhắn qua socket.io
   - Lưu text và URLs vào MongoDB
   - Broadcast tin nhắn đến người nhận nếu họ đang online

### Khi hiển thị tin nhắn có file đính kèm

1. **Backend**:
   - Truy vấn tin nhắn từ MongoDB
   - Trả về cả nội dung text và URLs của files

2. **Frontend**:
   - Hiển thị nội dung text
   - Hiển thị media dựa trên URLs từ Cloudinary

## 6. Chi tiết triển khai

### Backend

1. **Thiết lập server và kết nối socket.io**:
```javascript
// app.js
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Kết nối MongoDB...
// Thiết lập routes...

// Khởi tạo socket.io
socketHandler(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

2. **Schema tin nhắn trong MongoDB**:
```javascript
// MessageModel.js
const mongoose = require('mongoose');

const MediaAttachmentSchema = new mongoose.Schema({
  type: String,
  name: String,
  url: String,
  publicId: String
});

const MessageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  text: String,
  attachments: [MediaAttachmentSchema],
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, createdAt: -1 });
```

3. **Socket handler**:
```javascript
// socketHandler.js
const MessageController = require('../controllers/MessageController');

// Map để lưu kết nối socket của mỗi user
const userSocketMap = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    // Authentication...
    
    // Xử lý join room
    socket.on('join-room', (userId) => {
      userSocketMap.set(userId, socket.id);
      // ...
    });
    
    // Xử lý gửi tin nhắn
    socket.on('send-message', async (messageData) => {
      try {
        // Lưu tin nhắn vào DB
        const savedMessage = await MessageController.saveMessage(messageData);
        
        // Gửi xác nhận cho người gửi
        socket.emit('message-sent', savedMessage);
        
        // Gửi tin nhắn cho người nhận nếu họ online
        const receiverSocketId = userSocketMap.get(messageData.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive-message', savedMessage);
        }
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });
    
    // Xử lý các sự kiện khác...
  });
};
```

### Frontend

1. **Upload media lên Cloudinary**:
```javascript
// ChatBox.js - handleSendMessage function
const handleSendMessage = async () => {
  // ...
  
  try {
    // Upload media files to Cloudinary
    const processedAttachments = await Promise.all(
      attachments.map(async (attachment) => {
        const formData = new FormData();
        formData.append('file', attachment.file);
        formData.append('upload_preset', 'your_upload_preset'); 
        
        const resourceType = attachment.type.startsWith('image/') 
          ? 'image' : attachment.type.startsWith('video/') 
            ? 'video' : 'auto';
        
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/your_cloud_name/${resourceType}/upload`,
          formData
        );
        
        return {
          type: attachment.type,
          name: attachment.name,
          url: response.data.secure_url,
          publicId: response.data.public_id
        };
      })
    );
    
    // Gửi tin nhắn qua socket
    socket.emit('send-message', {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      text: message,
      attachments: processedAttachments
    });
    
    // Clear form...
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

2. **Hiển thị media từ Cloudinary**:
```javascript
// ChatBox.js - renderAttachments function
const renderAttachments = (attachments) => {
  if (!attachments || !attachments.length) return null;
  
  return (
    <div className="media-attachments">
      {attachments.map((attachment) => {
        if (attachment.type.startsWith('image/')) {
          return (
            <img 
              key={attachment.url} 
              src={attachment.url} 
              alt={attachment.name || 'Image'} 
              className="attachment-image" 
            />
          );
        } else if (attachment.type.startsWith('video/')) {
          return (
            <video key={attachment.url} controls className="attachment-video">
              <source src={attachment.url} type={attachment.type} />
              Your browser does not support the video tag.
            </video>
          );
        } else {
          // Render other file types...
        }
      })}
    </div>
  );
};
```

## 7. Lợi ích của giải pháp

1. **Hiệu năng**:
   - Giảm tải cho MongoDB bằng cách lưu trữ các file media lớn trên Cloudinary
   - Truy vấn nhanh hơn do chỉ lưu URLs trong database

2. **Tối ưu hoá**:
   - Cloudinary tự động tối ưu hóa hình ảnh và video
   - Hỗ trợ CDN cho tải nhanh ở mọi vị trí địa lý

3. **Bảo mật**:
   - Cloudinary cung cấp các tùy chọn bảo mật cho media
   - MongoDB chỉ lưu URLs của media, không lưu dữ liệu nhạy cảm

4. **Khả năng mở rộng**:
   - Dễ dàng mở rộng khi số lượng người dùng và tin nhắn tăng
   - Không lo về giới hạn kích thước BSON của MongoDB (16MB)

## 8. Hướng dẫn cấu hình Cloudinary

1. Đăng nhập vào dashboard Cloudinary
2. Vào mục Settings > Upload
3. Tạo một Upload preset mới:
   - Tên: `second_hand_market` (hoặc tên bạn muốn)
   - Signing Mode: Có thể chọn `unsigned` cho frontend
   - Folder: Tạo folder riêng cho chat, ví dụ: `chat_media`
4. Lưu lại thông tin và sử dụng trong ứng dụng

## 9. Lưu ý bảo mật

1. **Upload preset**: Nếu sử dụng unsigned upload preset, cần giới hạn các loại file được upload và thiết lập giới hạn kích thước file
2. **Authentication**: Đảm bảo chỉ người dùng đã xác thực mới có thể upload files
3. **Validation**: Kiểm tra kỹ các file trước khi upload lên Cloudinary
4. **JWT**: Đảm bảo token JWT được sử dụng cho xác thực trong socket.io 