'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Link as LinkIcon, Loader2, Type, Clock } from 'lucide-react';
import Link from 'next/link';

const DEFAULT_ZOOM_URL =
  'https://us04web.zoom.us/j/6670132003?pwd=j7EMYbkboggH7BEwii7vSjeHniuXQb.1';

type ServicePageData = {
  title: string;
  description: string;
  zoomUrl: string;
  autoRedirectSeconds: number;
};

export default function ServicePageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [pageData, setPageData] = useState<ServicePageData>({
    title: 'Join Our Online Service',
    description:
      'Use this Zoom link to join our live online services. You can update it here whenever the meeting details change.',
    zoomUrl: DEFAULT_ZOOM_URL,
    autoRedirectSeconds: 2,
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/service', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();

      setPageData((prev) => ({
        ...prev,
        ...data,
        zoomUrl: data.zoomUrl || prev.zoomUrl || DEFAULT_ZOOM_URL,
        autoRedirectSeconds:
          typeof data.autoRedirectSeconds === 'number'
            ? data.autoRedirectSeconds
            : prev.autoRedirectSeconds,
      }));
    } catch (error) {
      console.error('Error loading service page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: ServicePageData & { updatedAt: string } = {
        ...pageData,
        zoomUrl: pageData.zoomUrl || DEFAULT_ZOOM_URL,
        autoRedirectSeconds:
          typeof pageData.autoRedirectSeconds === 'number' && pageData.autoRedirectSeconds >= 0
            ? pageData.autoRedirectSeconds
            : 0,
        updatedAt: new Date().toISOString(),
      } as any;

      const res = await fetch('/api/admin/pages/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');

      alert('Service page settings saved. Visit /service on the site to confirm.');
    } catch (error) {
      console.error('Error saving service page data:', error);
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
          <p className="text-gray-600">Loading service page settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Online Service Page</h1>
                <p className="text-sm text-gray-500">
                  Manage the Zoom link and text shown on the public /service page.
                </p>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Title & Description */}
          <section className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                <Type className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Page Text</h2>
                <p className="text-sm text-gray-500">
                  This text appears on the /service page while people are being redirected.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heading
                </label>
                <Input
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  placeholder="Join Our Online Service"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={pageData.description}
                  onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                  placeholder="Short message explaining that they are being redirected to Zoom."
                  rows={3}
                />
              </div>
            </div>
          </section>

          {/* Zoom Link & Redirect */}
          <section className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-50 flex items-center justify-center">
                <LinkIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Zoom Settings</h2>
                <p className="text-sm text-gray-500">
                  Update the Zoom meeting URL used by the /service page.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom Meeting URL
                </label>
                <Input
                  value={pageData.zoomUrl}
                  onChange={(e) => setPageData({ ...pageData, zoomUrl: e.target.value })}
                  placeholder="https://us04web.zoom.us/..."
                />
                <p className="mt-2 text-xs text-gray-500">
                  This link is used for the automatic redirect and the &quot;Join Service on Zoom&quot; button.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  Auto-redirect delay (seconds)
                </label>
                <Input
                  type="number"
                  min={0}
                  max={15}
                  value={pageData.autoRedirectSeconds}
                  onChange={(e) =>
                    setPageData({
                      ...pageData,
                      autoRedirectSeconds: Number(e.target.value || 0),
                    })
                  }
                  placeholder="2"
                  className="w-32"
                />
                <p className="mt-2 text-xs text-gray-500">
                  How many seconds to wait before automatically redirecting visitors to Zoom.
                  Set to 0 for an immediate redirect.
                </p>
              </div>
            </div>
          </section>

          {/* Helpful note */}
          <section className="bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900">
            <p>
              Tip: After saving, open a new tab and visit{' '}
              <code className="px-1 py-0.5 rounded bg-emerald-100 text-emerald-900">/service</code>{' '}
              on the main site to confirm the redirect behaves as expected.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

