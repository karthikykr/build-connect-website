'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  File,
  Download,
  Check,
  CheckCheck
} from 'lucide-react';
import { ChatMessage, ChatParticipant } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ChatInterfaceProps {
  chatId: string;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
  onFileUpload?: (file: File) => void;
  isTyping?: boolean;
  typingUsers?: string[];
  className?: string;
}

export function ChatInterface({
  chatId,
  participants,
  messages,
  onSendMessage,
  onFileUpload,
  isTyping = false,
  typingUsers = [],
  className
}: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const otherParticipant = participants.find(p => p.id !== user?.id);
  const chatTitle = participants.length > 2 
    ? `Group Chat (${participants.length} members)`
    : otherParticipant?.name || 'Chat';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const getMessageStatus = (message: ChatMessage) => {
    if (message.senderId !== user?.id) return null;
    
    if (message.readBy && message.readBy.length > 1) {
      return <CheckCheck className="w-4 h-4 text-primary" />;
    } else if (message.deliveredAt) {
      return <CheckCheck className="w-4 h-4 text-text-secondary" />;
    } else {
      return <Check className="w-4 h-4 text-text-secondary" />;
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isOwnMessage = message.senderId === user?.id;
    const sender = participants.find(p => p.id === message.senderId);

    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
          {/* Sender name for group chats */}
          {!isOwnMessage && participants.length > 2 && (
            <p className="text-xs text-text-secondary mb-1 ml-3">
              {sender?.name}
            </p>
          )}
          
          <div
            className={`rounded-2xl px-4 py-2 ${
              isOwnMessage
                ? 'bg-primary text-white rounded-br-md'
                : 'bg-gray-light text-text-primary rounded-bl-md'
            }`}
          >
            {/* Message Content */}
            {message.type === 'text' && (
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            )}
            
            {message.type === 'image' && (
              <div>
                <img
                  src={message.content}
                  alt="Shared image"
                  className="rounded-lg max-w-full h-auto mb-2"
                />
                {message.text && (
                  <p className="text-sm">{message.text}</p>
                )}
              </div>
            )}
            
            {message.type === 'file' && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <File className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.fileName}</p>
                  <p className="text-xs opacity-75">{message.fileSize}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-current">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            {/* Message timestamp and status */}
            <div className={`flex items-center justify-between mt-1 ${
              isOwnMessage ? 'text-white/70' : 'text-text-secondary'
            }`}>
              <span className="text-xs">
                {formatRelativeTime(message.createdAt)}
              </span>
              {getMessageStatus(message)}
            </div>
          </div>
        </div>
        
        {/* Avatar */}
        {!isOwnMessage && (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3 order-0">
            <span className="text-white text-xs font-medium">
              {sender?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <CardHeader className="border-b border-gray-light">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {otherParticipant?.name?.charAt(0).toUpperCase() || 'G'}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">{chatTitle}</CardTitle>
              {participants.length === 2 && otherParticipant?.isOnline && (
                <p className="text-sm text-success">Online</p>
              )}
              {typingUsers.length > 0 && (
                <p className="text-sm text-text-secondary">
                  {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Info className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Start a conversation
              </h3>
              <p className="text-text-secondary">
                Send a message to begin chatting with {chatTitle}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      {/* Message Input */}
      <div className="border-t border-gray-light p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-end space-x-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
                multiline
                rows={1}
              />
              <Button
                variant="primary"
                size="icon"
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        
        {/* Emoji Picker Placeholder */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 right-4 bg-white border border-gray-light rounded-lg shadow-lg p-4 mb-2">
            <div className="grid grid-cols-8 gap-2">
              {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🎉'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessageText(prev => prev + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:bg-gray-light rounded p-1"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
