'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image as ImageIcon, Type, Loader2, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

export default function FooterPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [pageData, setPageData] = useState({
    logo: '/images/holy-ghost-zone-logo.png',
    description: 'We are a community based church with a keen interest in impacting our community through transformational Christ-centered activities and programs.',
    socialMedia: {
      facebook: '',
      instagram: '',
      youtube: '',
      twitter: '',
    },
    quickLinks: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '#events' },
      { label: 'Teachings', href: '#teachings' },
    ],
    serviceTimes: [
      { title: 'Sunday Worship', time: '11:00 AM' },
      { title: 'Tuesday House Fellowship & Bible Study', time: '7:30 PM (Zoom)' },
      { title: 'Thursday Shiloh Hour', time: '7:00 PM (Zoom)' },
    ],
    contactInfo: {
      address: 'Delta Hotels Milton Keynes\nTimbold Drive, Kents Hill\nMilton Keynes, MK7 6HL\nUnited Kingdom',
      phone: '+44 7445 423178',
      email: 'info@holyghostzonemk.org',
    },
    copyright: 'Holy Ghost Zone MK. All rights reserved.',
    developerCredit: {
      text: 'Developed by',
      link: 'https://www.sillylittletools.com',
      linkText: 'SillyLittleTools',
    },
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/footer', { cache: 'no-store' });
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
      const res = await fetch('/api/admin/pages/footer', {
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Footer</h1>
                <p className="text-sm text-gray-500">Manage footer content and links</p>
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
          {/* Logo Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Logo</h3>
                <p className="text-sm text-gray-500">Footer logo image</p>
              </div>
            </div>
            <ImageUpload
              value={pageData.logo}
              onChange={(url) => setPageData({ ...pageData, logo: url })}
              placeholder="/images/holy-ghost-zone-logo.png"
              previewClassName="w-full h-32 object-contain"
            />
          </div>

          {/* Description Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Description</h3>
                <p className="text-sm text-gray-500">Church description text</p>
              </div>
            </div>
            <Textarea
              value={pageData.description}
              onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
              placeholder="Enter church description"
              rows={3}
              className="w-full"
            />
          </div>

          {/* Social Media Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Social Media Links</h3>
                <p className="text-sm text-gray-500">Social media profile URLs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                <Input
                  value={pageData.socialMedia.facebook}
                  onChange={(e) => setPageData({ ...pageData, socialMedia: { ...pageData.socialMedia, facebook: e.target.value }})}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                <Input
                  value={pageData.socialMedia.instagram}
                  onChange={(e) => setPageData({ ...pageData, socialMedia: { ...pageData.socialMedia, instagram: e.target.value }})}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                <Input
                  value={pageData.socialMedia.youtube}
                  onChange={(e) => setPageData({ ...pageData, socialMedia: { ...pageData.socialMedia, youtube: e.target.value }})}
                  placeholder="https://youtube.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                <Input
                  value={pageData.socialMedia.twitter}
                  onChange={(e) => setPageData({ ...pageData, socialMedia: { ...pageData.socialMedia, twitter: e.target.value }})}
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Links</h3>
                <p className="text-sm text-gray-500">Navigation links in footer</p>
              </div>
            </div>
            <div className="space-y-4">
              {pageData.quickLinks.map((link, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const newLinks = [...pageData.quickLinks];
                        newLinks[index] = { ...link, label: e.target.value };
                        setPageData({ ...pageData, quickLinks: newLinks });
                      }}
                      placeholder="Link label"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <Input
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...pageData.quickLinks];
                        newLinks[index] = { ...link, href: e.target.value };
                        setPageData({ ...pageData, quickLinks: newLinks });
                      }}
                      placeholder="/about"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setPageData({ ...pageData, quickLinks: [...pageData.quickLinks, { label: '', href: '' }] })}
              >
                Add Link
              </Button>
            </div>
          </div>

          {/* Service Times Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Service Times</h3>
                <p className="text-sm text-gray-500">Service schedule information</p>
              </div>
            </div>
            <div className="space-y-4">
              {pageData.serviceTimes.map((service, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Title</label>
                    <Input
                      value={service.title}
                      onChange={(e) => {
                        const newServices = [...pageData.serviceTimes];
                        newServices[index] = { ...service, title: e.target.value };
                        setPageData({ ...pageData, serviceTimes: newServices });
                      }}
                      placeholder="Sunday Worship"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <Input
                      value={service.time}
                      onChange={(e) => {
                        const newServices = [...pageData.serviceTimes];
                        newServices[index] = { ...service, time: e.target.value };
                        setPageData({ ...pageData, serviceTimes: newServices });
                      }}
                      placeholder="11:00 AM"
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setPageData({ ...pageData, serviceTimes: [...pageData.serviceTimes, { title: '', time: '' }] })}
              >
                Add Service Time
              </Button>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                <p className="text-sm text-gray-500">Contact details displayed in footer</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address (use line breaks for formatting)</label>
                <Textarea
                  value={pageData.contactInfo.address}
                  onChange={(e) => setPageData({ ...pageData, contactInfo: { ...pageData.contactInfo, address: e.target.value }})}
                  placeholder="Street Address&#10;City, State ZIP"
                  rows={4}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  value={pageData.contactInfo.phone}
                  onChange={(e) => setPageData({ ...pageData, contactInfo: { ...pageData.contactInfo, phone: e.target.value }})}
                  placeholder="+44 7445 423178"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  value={pageData.contactInfo.email}
                  onChange={(e) => setPageData({ ...pageData, contactInfo: { ...pageData.contactInfo, email: e.target.value }})}
                  placeholder="info@holyghostzonemk.org"
                />
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Copyright & Credits</h3>
                <p className="text-sm text-gray-500">Footer copyright and developer credit</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
                <Input
                  value={pageData.copyright}
                  onChange={(e) => setPageData({ ...pageData, copyright: e.target.value })}
                  placeholder="Holy Ghost Zone MK. All rights reserved."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer Credit Text</label>
                  <Input
                    value={pageData.developerCredit.text}
                    onChange={(e) => setPageData({ ...pageData, developerCredit: { ...pageData.developerCredit, text: e.target.value }})}
                    placeholder="Developed by"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer Link</label>
                  <Input
                    value={pageData.developerCredit.link}
                    onChange={(e) => setPageData({ ...pageData, developerCredit: { ...pageData.developerCredit, link: e.target.value }})}
                    placeholder="https://www.sillylittletools.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Link Text</label>
                  <Input
                    value={pageData.developerCredit.linkText}
                    onChange={(e) => setPageData({ ...pageData, developerCredit: { ...pageData.developerCredit, linkText: e.target.value }})}
                    placeholder="SillyLittleTools"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
