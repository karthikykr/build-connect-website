'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  Home,
  MapPin,
  Users,
  Wrench,
  MessageCircle,
  Settings,
  BarChart3,
  FileText,
  UserCheck,
  Building,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Shield,
  Search,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  roles?: string[];
  badge?: string;
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const sidebarItems: SidebarItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Properties',
      href: '/properties',
      icon: Building,
    },
    {
      name: 'Map Explorer',
      href: '/map',
      icon: MapPin,
    },
    {
      name: 'Brokers',
      href: '/brokers',
      icon: Users,
    },
    {
      name: 'Contractors',
      href: '/contractors',
      icon: Wrench,
    },
    {
      name: 'Messages',
      href: '/chat',
      icon: MessageCircle,
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
    },
    // Role-specific items
    {
      name: 'Commissions',
      href: '/commissions',
      icon: DollarSign,
      roles: ['broker', 'contractor'],
    },
    {
      name: 'Property Dashboard',
      href: '/properties/dashboard',
      icon: BarChart3,
      roles: ['broker'],
    },
    {
      name: 'My Listings',
      href: '/properties/my-listings',
      icon: Building,
      roles: ['broker'],
    },
    {
      name: 'Add Property',
      href: '/properties/add',
      icon: Home,
      roles: ['broker'],
    },
    {
      name: 'My Listings',
      href: '/properties/my-listings',
      icon: FileText,
      roles: ['broker'],
    },
    {
      name: 'Site Scouting',
      href: '/site-scouting',
      icon: Search,
      roles: ['broker', 'buyer'],
    },
    {
      name: 'Applications',
      href: '/brokers/applications',
      icon: UserCheck,
      roles: ['broker'],
    },
    {
      name: 'My Projects',
      href: '/contractors/projects',
      icon: Wrench,
      roles: ['contractor'],
    },
    {
      name: 'Portfolio',
      href: '/contractors/portfolio',
      icon: BarChart3,
      roles: ['contractor'],
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      roles: ['admin'],
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      roles: ['admin'],
    },
    {
      name: 'Broker Verification',
      href: '/broker-verification',
      icon: Shield,
      roles: ['admin'],
    },
    {
      name: 'Settings',
      href: '/profile',
      icon: Settings,
    },
  ];

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div
      className={cn(
        'border-r border-gray-light bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="border-b border-gray-light p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-white">BC</span>
              </div>
              <span className="font-playwrite text-lg font-bold text-text-primary">
                BUILD-CONNECT
              </span>
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-1.5 transition-colors hover:bg-gray-light"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-text-secondary" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredItems.map(item => {
            const IconComponent = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 transition-colors duration-200',
                    active
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:bg-gray-light/50 hover:text-primary',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  <IconComponent className="h-5 w-5" />
                  {!isCollapsed && (
                    <>
                      <span className="ml-3 font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto rounded-full bg-error px-2 py-0.5 text-xs text-white">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info (when not collapsed) */}
      {!isCollapsed && user && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-lg bg-gray-light/50 p-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <span className="text-sm font-medium text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text-primary">
                  {user.name}
                </p>
                <p className="text-xs capitalize text-text-secondary">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
