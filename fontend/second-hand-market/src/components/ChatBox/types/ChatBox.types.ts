// Chat Message Types
export interface MediaAttachment {
  id: string | number;
  type: string;
  url: string;
  name?: string;
  _id?: string;
}

export interface ChatMessage {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    avatar?: {
      url: string;
    };
  };
  receiver: {
    _id: string;
    fullName: string;
    avatar?: {
      url: string;
    };
  };
  content: string;
  media: MediaAttachment[];
  type: 'text' | 'image' | 'video' | 'file' | 'product' | 'order';
  timestamp: string | Date | number;
  createdAt?: string | Date | number;
  isAI?: boolean;
  payload?: any;
  productSuggestions?: any[];
}

export interface ChatPartner {
  _id: string;
  fullName: string;
  avatar?: {
    url: string;
  };
  isOnline?: boolean;
  lastMessage?: string;
  lastMessageTime?: string | Date | number;
  unreadCount?: number;
}

export interface Attachment {
  id: string | number;
  file: File;
  preview: string;
  type: string;
  name: string;
}

// Component Props Types
export interface ChatHeaderProps {
  selectedUser: ChatPartner | null;
  onBack: () => void;
  onClose: () => void;
}

export interface ChatSidebarProps {
  chatPartners: ChatPartner[];
  selectedUserId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectUser: (user: ChatPartner) => void;
}

export interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isLoadingMessages: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onDeleteMessage: (messageId: string) => void;
  onSetFullscreenImage: (src: string) => void;
}

export interface ChatInputProps {
  message: string;
  attachments: Attachment[];
  isSending: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onAttachFile: () => void;
  onRemoveAttachment: (id: string | number) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface MessageItemProps {
  message: ChatMessage;
  isMe: boolean;
  onDelete: (messageId: string) => void;
  onSetFullscreenImage: (src: string) => void;
}

// Styled Component Props
export interface TypingDotProps {
  delay: string;
}

export interface FullscreenImageProps {
  zoomLevel: number;
}

export interface StyledAvatarProps {
  isonline: string;
}

export interface MessageBubbleProps {
  sender: string;
  isAI?: boolean;
}

export interface ChatCardItemProps {
  avatar: string;
  name: string;
  subtitle: string;
  chipLabel?: string;
  selected: boolean;
  onClick: () => void;
}
