'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Image as ImageIcon, Type, Loader2, Link as LinkIcon, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

export default function HeaderPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [pageData, setPageData] = useState({
    mainLogo: '/images/holy-ghost-zone-logo.png',
    affiliateLogo: '/images/affchurch.avif',
    affiliateLink: 'https://www.rccg.org/',
    navItems: [
      { href: '/', label: 'Home', visible: true },
      { href: '/about', label: 'About', visible: true },
      { href: '/events', label: 'Events', visible: true },
      { href: '/teachings', label: 'Teachings', visible: true },
      { href: '/gallery', label: 'Gallery', visible: true },
    ],
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/header', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      if (Object.keys(data).length > 0) {
        setPageData(prevData => ({
          ...prevData,
          ...data
        }));
      }
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pages/header', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Header / Navigation</h1>
                <p className="text-sm text-gray-500">Manage header logos and navigation menu</p>
              </div>
            </div>
            <Button onClick={handleSave} className="gap-2" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Main Logo Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Main Logo</h3>
                <p className="text-sm text-gray-500">Primary logo displayed on the left side of header</p>
              </div>
            </div>
            <ImageUpload
              value={pageData.mainLogo}
              onChange={(url) => setPageData({ ...pageData, mainLogo: url })}
              placeholder="/images/holy-ghost-zone-logo.png"
              previewClassName="w-full h-32 object-contain"
            />
          </div>

          {/* Affiliate Logo Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Affiliate Logo</h3>
                <p className="text-sm text-gray-500">Partner church logo displayed on the right side of header</p>
              </div>
            </div>
            <div className="space-y-4">
              <ImageUpload
                value={pageData.affiliateLogo}
                onChange={(url) => setPageData({ ...pageData, affiliateLogo: url })}
                placeholder="/images/affchurch.avif"
                previewClassName="w-full h-32 object-contain"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Link</label>
                <Input
                  value={pageData.affiliateLink}
                  onChange={(e) => setPageData({ ...pageData, affiliateLink: e.target.value })}
                  placeholder="https://www.rccg.org/"
                />
              </div>
            </div>
          </div>

          {/* Navigation Items Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Navigation Menu Items</h3>
                <p className="text-sm text-gray-500">Manage navigation links in the header</p>
              </div>
            </div>
            <div className="space-y-4">
              {pageData.navItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                    <Input
                      value={item.label}
                      onChange={(e) => {
                        const newItems = [...pageData.navItems];
                        newItems[index] = { ...item, label: e.target.value };
                        setPageData({ ...pageData, navItems: newItems });
                      }}
                      placeholder="Home"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <Input
                      value={item.href}
                      onChange={(e) => {
                        const newItems = [...pageData.navItems];
                        newItems[index] = { ...item, href: e.target.value };
                        setPageData({ ...pageData, navItems: newItems });
                      }}
                      placeholder="/about"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant={item.visible ? "default" : "outline"}
                      onClick={() => {
                        const newItems = [...pageData.navItems];
                        newItems[index] = { ...item, visible: !item.visible };
                        setPageData({ ...pageData, navItems: newItems });
                      }}
                      className="w-full"
                    >
                      {item.visible ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hidden
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newItems = pageData.navItems.filter((_, i) => i !== index);
                        setPageData({ ...pageData, navItems: newItems });
                      }}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setPageData({ ...pageData, navItems: [...pageData.navItems, { label: '', href: '', visible: true }] })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Navigation Item
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
