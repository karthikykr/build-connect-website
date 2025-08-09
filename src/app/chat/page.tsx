'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout';
import { ChatList } from '@/components/features/chat/ChatList';
import { ChatInterface } from '@/components/features/chat/ChatInterface';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  MessageCircle, 
  Users,
  Plus,
  Settings
} from 'lucide-react';
import { Chat, ChatMessage, ChatParticipant } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// Mock data for demonstration
const mockChats: Chat[] = [
  {
    id: '1',
    type: 'direct',
    participants: [
      {
        id: '1',
        name: 'Rajesh Kumar',
        avatar: '',
        isOnline: true,
        lastSeen: new Date().toISOString(),
      },
      {
        id: 'current-user',
        name: 'You',
        avatar: '',
        isOnline: true,
        lastSeen: new Date().toISOString(),
      },
    ],
    lastMessage: {
      id: '1',
      senderId: '1',
      content: 'Hi! I saw your property listing in Whitefield. Is it still available?',
      type: 'text',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readBy: ['current-user'],
    },
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'direct',
    participants: [
      {
        id: '2',
        name: 'Priya Sharma',
        avatar: '',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'current-user',
        name: 'You',
        avatar: '',
        isOnline: true,
        lastSeen: new Date().toISOString(),
      },
    ],
    lastMessage: {
      id: '2',
      senderId: 'current-user',
      content: 'Thank you for the property tour. I\'ll get back to you soon.',
      type: 'text',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      readBy: ['2'],
    },
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    content: 'Hi! I saw your property listing in Whitefield. Is it still available?',
    type: 'text',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    readBy: ['current-user'],
  },
  {
    id: '2',
    senderId: 'current-user',
    content: 'Yes, it\'s still available! Would you like to schedule a visit?',
    type: 'text',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    deliveredAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    readBy: ['1'],
  },
  {
    id: '3',
    senderId: '1',
    content: 'That would be great! What time works for you this weekend?',
    type: 'text',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    readBy: ['current-user'],
  },
];

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API call to load chats
    setTimeout(() => {
      setChats(mockChats);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Load messages when chat is selected
    if (selectedChatId) {
      setLoading(true);
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 500);
    }
  }, [selectedChatId]);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    
    // Mark chat as read
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, unreadCount: 0 }
        : chat
    ));
  };

  const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
    if (!selectedChatId || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content,
      type,
      createdAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      readBy: [user.id],
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update last message in chat list
    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId
        ? { 
            ...chat, 
            lastMessage: newMessage,
            updatedAt: new Date().toISOString()
          }
        : chat
    ));
  };

  const handleFileUpload = (file: File) => {
    // Simulate file upload
    const fileUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      content: fileUrl,
      type: isImage ? 'image' : 'file',
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      createdAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      readBy: [user?.id || ''],
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleNewChat = () => {
    // Implement new chat creation
    console.log('Create new chat');
  };

  const handleNewGroup = () => {
    // Implement new group creation
    console.log('Create new group');
  };

  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  const breadcrumbs = [
    { label: 'Messages', current: true }
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout
        breadcrumbs={breadcrumbs}
        title="Messages"
        description="Chat with brokers, contractors, and other users"
        actions={
          <div className="flex items-center space-x-2">
            <Button variant="outline" leftIcon={<Users className="w-4 h-4" />}>
              New Group
            </Button>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              New Chat
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List */}
          <div className="lg:col-span-1">
            {loading && !selectedChatId ? (
              <Card className="h-full flex items-center justify-center">
                <Loading size="lg" text="Loading chats..." />
              </Card>
            ) : (
              <ChatList
                chats={chats}
                selectedChatId={selectedChatId || undefined}
                onChatSelect={handleChatSelect}
                onNewChat={handleNewChat}
                onNewGroup={handleNewGroup}
              />
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedChatId && selectedChat ? (
              loading ? (
                <Card className="h-full flex items-center justify-center">
                  <Loading size="lg" text="Loading messages..." />
                </Card>
              ) : (
                <ChatInterface
                  chatId={selectedChatId}
                  participants={selectedChat.participants}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onFileUpload={handleFileUpload}
                  isTyping={isTyping}
                  typingUsers={typingUsers}
                />
              )
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="w-24 h-24 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Choose a chat from the sidebar to start messaging
                  </p>
                  <div className="flex items-center justify-center space-x-3">
                    <Button variant="outline" onClick={handleNewChat}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Chat
                    </Button>
                    <Button variant="primary" onClick={handleNewGroup}>
                      <Users className="w-4 h-4 mr-2" />
                      New Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
