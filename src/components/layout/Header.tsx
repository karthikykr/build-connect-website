'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Home,
  MapPin,
  Users,
  Wrench,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigationItems = [
    { name: 'Properties', href: '/properties', icon: Home },
    { name: 'Brokers', href: '/brokers', icon: Users },
    { name: 'Contractors', href: '/contractors', icon: Wrench },
    { name: 'Map', href: '/map', icon: MapPin },
    { name: 'Support', href: '/support', icon: HelpCircle },
  ];

  const authenticatedNavigationItems = [
    ...navigationItems,
    { name: 'Chat', href: '/chat', icon: MessageCircle },
  ];

  const currentNavItems = isAuthenticated ? authenticatedNavigationItems : navigationItems;

  return (
    <header className="bg-card border-b border-gray-light sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="text-xl font-bold text-text-primary font-playwrite">
              BUILD-CONNECT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {currentNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-secondary hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {isAuthenticated ? (
              /* User Menu */
              <HeadlessMenu as="div" className="relative">
                <MenuButton className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </MenuButton>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-gray-light py-1">
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/dashboard"
                          className={`${
                            active ? 'bg-gray-light' : ''
                          } flex items-center px-4 py-2 text-sm text-text-primary`}
                        >
                          <Home className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <Link
                          href="/profile"
                          className={`${
                            active ? 'bg-gray-light' : ''
                          } flex items-center px-4 py-2 text-sm text-text-primary`}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                      )}
                    </MenuItem>
                    <div className="border-t border-gray-light my-1" />
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${
                            active ? 'bg-gray-light' : ''
                          } flex items-center w-full px-4 py-2 text-sm text-text-primary`}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </HeadlessMenu>
            ) : (
              /* Auth Buttons */
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-light">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentNavItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-3 py-2 text-text-secondary hover:text-primary hover:bg-gray-light/50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-light my-2" />
                  <Link
                    href="/dashboard"
                    className="flex items-center px-3 py-2 text-text-secondary hover:text-primary hover:bg-gray-light/50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center px-3 py-2 text-text-secondary hover:text-primary hover:bg-gray-light/50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-text-secondary hover:text-primary hover:bg-gray-light/50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-light my-2" />
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="primary" className="w-full justify-start">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
