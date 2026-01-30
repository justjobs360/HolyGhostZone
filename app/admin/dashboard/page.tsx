'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Info, Calendar, BookOpen, Image, LogOut, User, Navigation, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const pages = [
    {
      id: 'home',
      title: 'Home',
      icon: Home,
      description: 'Manage homepage content, hero section, and featured areas',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      id: 'about',
      title: 'About',
      icon: Info,
      description: 'Edit about page, mission, vision, and team information',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      id: 'events',
      title: 'Events',
      icon: Calendar,
      description: 'Manage church events, add new events, and update details',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      id: 'teachings',
      title: 'Teachings',
      icon: BookOpen,
      description: 'Manage sermons, teachings, and spiritual resources',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      icon: Image,
      description: 'Upload and organize church photos and image galleries',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
    },
    {
      id: 'header',
      title: 'Header / Navigation',
      icon: Navigation,
      description: 'Manage header logos and navigation menu items',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
    },
    {
      id: 'footer',
      title: 'Footer',
      icon: FileText,
      description: 'Edit footer content, links, and contact information',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Holy Ghost Zone RCCG - Content Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 border border-gray-200">
                <User className="w-5 h-5 text-gray-600" />
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 border border-gray-700">
            <h2 className="text-3xl font-bold mb-3">Welcome Back!</h2>
            <p className="text-gray-300 text-lg">
              Select a page below to edit its content, update images, or manage layouts.
            </p>
          </div>
        </div>

        {/* Page Management Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Manage Pages</h3>
          <p className="text-gray-600">Click on any page to start editing</p>
        </div>

        {/* Page Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => router.push(`/admin/dashboard/pages/${page.id}`)}
                className="group bg-white border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 overflow-hidden text-left transform hover:scale-105"
              >
                {/* Colored Header */}
                <div className={`h-2 bg-gradient-to-r ${page.color}`}></div>
                
                {/* Card Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div className={`w-14 h-14 ${page.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${page.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {page.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {page.description}
                  </p>

                  {/* Action Indicator */}
                  <div className="flex items-center text-sm font-medium text-gray-900 group-hover:translate-x-2 transition-transform duration-300">
                    <span>Edit Page</span>
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Stats or Additional Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">7</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">Today</p>
              </div>
              <div className="w-12 h-12 bg-green-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active</p>
                <p className="text-3xl font-bold text-green-600">●</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                <User className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

