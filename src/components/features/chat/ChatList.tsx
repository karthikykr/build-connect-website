'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Search, 
  Plus, 
  MessageCircle,
  Users,
  MoreVertical,
  Pin,
  Archive,
  Trash2
} from 'lucide-react';
import { Chat, ChatParticipant } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ChatListProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat?: () => void;
  onNewGroup?: () => void;
  className?: string;
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
  onNewChat,
  onNewGroup,
  className
}: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');
  const { user } = useAuth();

  const filteredChats = chats.filter(chat => {
    // Search filter
    if (searchTerm) {
      const otherParticipant = chat.participants.find(p => p.id !== user?.id);
      const chatName = chat.type === 'group' 
        ? chat.name || 'Group Chat'
        : otherParticipant?.name || '';
      
      if (!chatName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Type filter
    if (filter === 'groups' && chat.type !== 'group') {
      return false;
    }
    
    if (filter === 'unread' && chat.unreadCount === 0) {
      return false;
    }

    return true;
  });

  const getChatName = (chat: Chat) => {
    if (chat.type === 'group') {
      return chat.name || `Group (${chat.participants.length} members)`;
    }
    
    const otherParticipant = chat.participants.find(p => p.id !== user?.id);
    return otherParticipant?.name || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.type === 'group') {
      return (
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
      );
    }
    
    const otherParticipant = chat.participants.find(p => p.id !== user?.id);
    return (
      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center relative">
        <span className="text-white font-medium">
          {otherParticipant?.name?.charAt(0).toUpperCase() || 'U'}
        </span>
        {otherParticipant?.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
        )}
      </div>
    );
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return 'No messages yet';
    
    const isOwnMessage = chat.lastMessage.senderId === user?.id;
    const prefix = isOwnMessage ? 'You: ' : '';
    
    switch (chat.lastMessage.type) {
      case 'image':
        return `${prefix}📷 Photo`;
      case 'file':
        return `${prefix}📎 ${chat.lastMessage.fileName}`;
      default:
        return `${prefix}${chat.lastMessage.content}`;
    }
  };

  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="border-b border-gray-light">
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Messages</CardTitle>
          <div className="flex items-center space-x-2">
            {onNewChat && (
              <Button variant="ghost" size="icon" onClick={onNewChat}>
                <MessageCircle className="w-4 h-4" />
              </Button>
            )}
            {onNewGroup && (
              <Button variant="ghost" size="icon" onClick={onNewGroup}>
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search conversations..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        
        {/* Filters */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'groups', label: 'Groups' },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              variant={filter === filterOption.key ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(filterOption.key as any)}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {searchTerm ? 'No chats found' : 'No conversations yet'}
            </h3>
            <p className="text-text-secondary mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start a conversation with brokers or contractors'
              }
            </p>
            {onNewChat && !searchTerm && (
              <Button variant="primary" onClick={onNewChat}>
                Start New Chat
              </Button>
            )}
          </div>
        ) : (
          <div>
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`flex items-center p-4 hover:bg-gray-light/50 cursor-pointer transition-colors border-b border-gray-light/50 ${
                  selectedChatId === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                }`}
              >
                {/* Avatar */}
                {getChatAvatar(chat)}
                
                {/* Chat Info */}
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-medium truncate ${
                      chat.unreadCount > 0 ? 'text-text-primary' : 'text-text-primary'
                    }`}>
                      {getChatName(chat)}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {chat.isPinned && (
                        <Pin className="w-3 h-3 text-text-secondary" />
                      )}
                      {chat.lastMessage && (
                        <span className="text-xs text-text-secondary">
                          {formatRelativeTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      chat.unreadCount > 0 ? 'font-medium text-text-primary' : 'text-text-secondary'
                    }`}>
                      {getLastMessagePreview(chat)}
                    </p>
                    
                    <div className="flex items-center space-x-2">
                      {chat.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                      {chat.isMuted && (
                        <div className="w-4 h-4 bg-text-secondary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🔇</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* More Options */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle more options
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
