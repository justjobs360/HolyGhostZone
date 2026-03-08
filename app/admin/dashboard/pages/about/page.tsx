'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image as ImageIcon, Type, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

export default function AboutPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // All sections state
  const [pageData, setPageData] = useState({
    hero: {
      title: 'About Holy Ghost Zone MK',
      subtitle: 'A vibrant community where faith meets modern life, creating space for authentic worship, meaningful relationships, and spiritual growth in the heart of our city.',
      backgroundImage: '/images/about.jpg'
    },
    mission: {
      title: 'Our Mission',
      description: 'To create an authentic community where people can encounter God, grow in faith, and discover their purpose. We believe in the transformative power of the Gospel and its ability to bring hope, healing, and restoration to every life.',
      image: '/church-worship.png',
      stat1: '500+',
      stat1Label: 'Community Members',
      stat2: '15+',
      stat2Label: 'Years Serving'
    },
    reflection: {
      title: 'What If You Belong Here?',
      backgroundImage: '/images/shakespear.jpg'
    },
    ourBeliefs: {
      visible: true,
      title: 'Our Beliefs',
      subtitle: '',
      items: Array.from({ length: 13 }, (_, i) => ({ title: `Belief ${i + 1}`, content: '' }))
    },
    values: {
      title: 'Our Core Values',
      subtitle: 'These values guide everything we do as a community of faith',
      image: '/images/aboutus2.jpg',
      tabs: [
        'Authentic Love',
        'Genuine Community',
        'Biblical Truth',
        'Global Impact'
      ]
    },
    reflection2: {
      backgroundImage: '/images/aboutus3.jpg'
    }
  });

  // Load data from Firebase on mount
  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/about', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setPageData(prevData => {
        const next = { ...prevData, ...data };
        if (next.ourBeliefs && !(next.ourBeliefs.items?.length) && next.ourBeliefs.content) {
          next.ourBeliefs = { ...next.ourBeliefs, items: [{ title: next.ourBeliefs.title || 'Our Beliefs', content: next.ourBeliefs.content }] };
        }
        if (next.ourBeliefs && !Array.isArray(next.ourBeliefs.items)) {
          next.ourBeliefs = { ...next.ourBeliefs, items: Array.from({ length: 13 }, (_, i) => ({ title: `Belief ${i + 1}`, content: '' })) };
        }
        return next;
      });
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pages/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      alert('Changes saved successfully! Refresh the about page to see your changes.');
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
      {/* Header */}
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
                <h1 className="text-2xl font-bold text-gray-900">Edit About Page</h1>
                <p className="text-sm text-gray-500">Manage about page content and components</p>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Component List */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Sections</h3>
              <nav className="space-y-2">
                <a href="#hero-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Hero Section
                </a>
                <a href="#mission-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Mission & Vision
                </a>
                <a href="#reflection-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Reflection Section
                </a>
                <a href="#our-beliefs-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Our Beliefs
                </a>
                <a href="#values-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Values Section
                </a>
                <a href="#reflection2-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Reflection 2
                </a>
              </nav>
            </div>
          </div>

          {/* Right Content - Editable Components */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div id="hero-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Hero Section</h3>
                  <p className="text-sm text-gray-500">Main landing section with title and subtitle</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Main Title
                  </label>
                  <Input
                    value={pageData.hero.title}
                    onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, title: e.target.value }})}
                    placeholder="Enter main title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <Textarea
                    value={pageData.hero.subtitle}
                    onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, subtitle: e.target.value }})}
                    placeholder="Enter subtitle"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Background Image
                  </label>
                  <ImageUpload
                    value={pageData.hero.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, hero: { ...pageData.hero, backgroundImage: url }})}
                    placeholder="/images/about.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div id="mission-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mission & Vision Section</h3>
                  <p className="text-sm text-gray-500">Church mission, stats, and image</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.mission.title}
                    onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, title: e.target.value }})}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={pageData.mission.description}
                    onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, description: e.target.value }})}
                    placeholder="Enter mission description"
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stat 1 Value
                      </label>
                      <Input
                        value={pageData.mission.stat1}
                        onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, stat1: e.target.value }})}
                        placeholder="500+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stat 1 Label
                      </label>
                      <Input
                        value={pageData.mission.stat1Label}
                        onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, stat1Label: e.target.value }})}
                        placeholder="Community Members"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stat 2 Value
                      </label>
                      <Input
                        value={pageData.mission.stat2}
                        onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, stat2: e.target.value }})}
                        placeholder="15+"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stat 2 Label
                      </label>
                      <Input
                        value={pageData.mission.stat2Label}
                        onChange={(e) => setPageData({ ...pageData, mission: { ...pageData.mission, stat2Label: e.target.value }})}
                        placeholder="Years Serving"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Image
                  </label>
                  <ImageUpload
                    value={pageData.mission.image}
                    onChange={(url) => setPageData({ ...pageData, mission: { ...pageData.mission, image: url }})}
                    placeholder="/church-worship.png"
                  />
                </div>
              </div>
            </div>

            {/* Reflection Section */}
            <div id="reflection-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reflection Section 1</h3>
                  <p className="text-sm text-gray-500">Philosopical reflection with background image</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.reflection.title}
                    onChange={(e) => setPageData({ ...pageData, reflection: { ...pageData.reflection, title: e.target.value }})}
                    placeholder="Enter reflection title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Background Image
                  </label>
                  <ImageUpload
                    value={pageData.reflection.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, reflection: { ...pageData.reflection, backgroundImage: url }})}
                    placeholder="/images/shakespear.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Our Beliefs Section — same dropdown style as former Leadership */}
            <div id="our-beliefs-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Our Beliefs</h3>
                  <p className="text-sm text-gray-500">Section title and dropdown items. Add or remove beliefs; each has a title and content.</p>
                </div>
              </div>

              <div className="space-y-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageData.ourBeliefs?.visible !== false}
                    onChange={(e) => setPageData({
                      ...pageData,
                      ourBeliefs: { ...pageData.ourBeliefs, visible: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Show section on About page</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section title</label>
                  <Input
                    value={pageData.ourBeliefs?.title ?? 'Our Beliefs'}
                    onChange={(e) => setPageData({
                      ...pageData,
                      ourBeliefs: { ...pageData.ourBeliefs, title: e.target.value }
                    })}
                    placeholder="Our Beliefs"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle (optional)</label>
                  <Input
                    value={pageData.ourBeliefs?.subtitle ?? ''}
                    onChange={(e) => setPageData({
                      ...pageData,
                      ourBeliefs: { ...pageData.ourBeliefs, subtitle: e.target.value }
                    })}
                    placeholder="e.g. What we believe as a church"
                    className="w-full"
                  />
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Beliefs (each = one dropdown on the page)</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPageData({
                        ...pageData,
                        ourBeliefs: {
                          ...pageData.ourBeliefs,
                          items: [...(pageData.ourBeliefs?.items ?? []), { title: '', content: '' }]
                        }
                      })}
                    >
                      Add belief
                    </Button>
                  </div>
                  {(pageData.ourBeliefs?.items ?? []).map((belief, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Belief {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            const items = (pageData.ourBeliefs?.items ?? []).filter((_, i) => i !== index);
                            setPageData({
                              ...pageData,
                              ourBeliefs: { ...pageData.ourBeliefs, items }
                            });
                          }}
                          disabled={(pageData.ourBeliefs?.items?.length ?? 0) <= 1}
                        >
                          Remove
                        </Button>
                      </div>
                      <Input
                        value={belief.title}
                        onChange={(e) => {
                          const items = [...(pageData.ourBeliefs?.items ?? [])];
                          items[index] = { ...belief, title: e.target.value };
                          setPageData({ ...pageData, ourBeliefs: { ...pageData.ourBeliefs, items } });
                        }}
                        placeholder="Belief title"
                        className="w-full mb-3"
                      />
                      <Textarea
                        value={belief.content}
                        onChange={(e) => {
                          const items = [...(pageData.ourBeliefs?.items ?? [])];
                          items[index] = { ...belief, content: e.target.value };
                          setPageData({ ...pageData, ourBeliefs: { ...pageData.ourBeliefs, items } });
                        }}
                        placeholder="Content (shown when dropdown is open)"
                        rows={3}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div id="values-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Values Section</h3>
                  <p className="text-sm text-gray-500">Core values with tabs</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.values.title}
                    onChange={(e) => setPageData({ ...pageData, values: { ...pageData.values, title: e.target.value }})}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={pageData.values.subtitle}
                    onChange={(e) => setPageData({ ...pageData, values: { ...pageData.values, subtitle: e.target.value }})}
                    placeholder="Enter subtitle"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Image
                  </label>
                  <ImageUpload
                    value={pageData.values.image}
                    onChange={(url) => setPageData({ ...pageData, values: { ...pageData.values, image: url }})}
                    placeholder="/images/aboutus2.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value Tabs (4 values)
                  </label>
                  {pageData.values.tabs.map((tab, index) => (
                    <div key={index} className="mb-3">
                      <Input
                        value={tab}
                        onChange={(e) => {
                          const newTabs = [...pageData.values.tabs];
                          newTabs[index] = e.target.value;
                          setPageData({ ...pageData, values: { ...pageData.values, tabs: newTabs }});
                        }}
                        placeholder={`Value ${index + 1}`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reflection 2 Section */}
            <div id="reflection2-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Reflection Section 2</h3>
                  <p className="text-sm text-gray-500">Second reflection section</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Background Image
                  </label>
                  <ImageUpload
                    value={pageData.reflection2.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, reflection2: { ...pageData.reflection2, backgroundImage: url }})}
                    placeholder="/images/aboutus3.jpg"
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

