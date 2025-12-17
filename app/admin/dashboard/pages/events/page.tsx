'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image as ImageIcon, Type, Loader2, Plus, Trash2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

export default function EventsPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [eventsTab, setEventsTab] = useState<'list' | 'add'>('list');
  const [newEvent, setNewEvent] = useState({
    id: 0,
    title: '',
    date: '',
    time: '',
    location: '',
    category: '',
    attendees: '',
    image: '/images/fillerevents.jpg',
    description: '',
    buttonText: 'Learn More',
    buttonLink: '#',
  });

  // All sections state
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Upcoming Events',
      subtitle: 'Join us for meaningful gatherings, inspiring worship, and community-building events that strengthen our faith and deepen our connections.',
      backgroundImage: '/images/services.jpg'
    },
    reflection: {
      title: 'What If Community Changes Everything?',
      backgroundImage: '/images/carousel.jpg'
    },
    specialEventsTitle: 'Special Events',
    specialEventsSubtitle: 'Don\'t miss these upcoming special gatherings and community events',
    categoriesTitle: 'Event Categories',
    categoriesSubtitle: 'Explore different types of events and find what interests you most',
    categories: [
      {
        title: 'Worship Services',
        description: 'Regular Sunday services and special worship events',
        icon: 'Users'
      },
      {
        title: 'Community Events',
        description: 'Fellowship gatherings and social activities',
        icon: 'Calendar'
      },
      {
        title: 'Outreach Programs',
        description: 'Service projects and community involvement',
        icon: 'MapPin'
      },
      {
        title: 'Bible Studies',
        description: 'Weekly studies and spiritual growth opportunities',
        icon: 'Clock'
      }
    ],
    specialEvents: [
      {
        id: 1,
        title: 'Easter Celebration Service',
        date: 'March 31, 2024',
        time: '9:00 AM & 11:00 AM',
        location: 'Main Sanctuary',
        category: 'Worship',
        attendees: '350',
        image: '/images/fillerevents.jpg',
        description: 'Join us for a powerful Easter celebration as we rejoice in the resurrection of our Lord Jesus Christ. Special music, drama presentation, and communion service.'
      }
    ]
  });

  // Load data from Firebase on mount
  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/events', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setPageData(prevData => ({
        ...prevData,
        ...data
      }));
    } catch (error) {
      console.error('Error loading page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pages/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        })
      });
      if (!res.ok) throw new Error('Failed to save');

      alert('Changes saved successfully! Refresh the events page to see your changes.');
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Events Page</h1>
                <p className="text-sm text-gray-500">Manage events page content and components</p>
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
                <a href="#special-events-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Special Events
                </a>
                <a href="#reflection-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Reflection Section
                </a>
                <a href="#categories-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Event Categories
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
                    onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, title: e.target.value } })}
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
                    onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, subtitle: e.target.value } })}
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
                    onChange={(url) => setPageData({ ...pageData, hero: { ...pageData.hero, backgroundImage: url } })}
                    placeholder="/images/services.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Special Events Section */}
            <div id="special-events-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Special Events Section</h3>
                  <p className="text-sm text-gray-500">Upcoming events and details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.specialEventsTitle}
                    onChange={(e) => setPageData({ ...pageData, specialEventsTitle: e.target.value })}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <Input
                    value={pageData.specialEventsSubtitle}
                    onChange={(e) => setPageData({ ...pageData, specialEventsSubtitle: e.target.value })}
                    placeholder="Enter section subtitle"
                    className="w-full"
                  />
                </div>

                {/* Events Tabs */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      className={`px-3 py-1.5 text-sm border ${eventsTab === 'list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setEventsTab('list')}
                    >Events List</button>
                    <button
                      className={`px-3 py-1.5 text-sm border ${eventsTab === 'add' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setEventsTab('add')}
                    >Add New Event</button>
                  </div>

                  {eventsTab === 'list' && (
                    <div className="space-y-6">
                      {pageData.specialEvents.map((ev, index) => (
                        <div key={index} className="p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900">Event {index + 1}</h5>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                              <Input
                                value={ev.title}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, title: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="Event title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <Input
                                value={ev.date}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, date: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="e.g., March 31, 2024"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                              <Input
                                value={ev.time}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, time: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="e.g., 9:00 AM & 11:00 AM"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                              <Input
                                value={ev.location}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, location: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="Location details"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                              <Input
                                value={ev.category}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, category: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="e.g., Worship"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                              <Input
                                value={ev.attendees}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, attendees: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="e.g., 350"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                              <Input
                                value={(ev as any).buttonText || 'Learn More'}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, buttonText: e.target.value } as any
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="e.g. Join Zoom"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Button Link</label>
                              <Input
                                value={(ev as any).buttonLink || '#'}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, buttonLink: e.target.value } as any
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="https://..."
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <Textarea
                                value={ev.description}
                                onChange={(e) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, description: e.target.value }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="Short description"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Image</label>
                              <ImageUpload
                                value={ev.image}
                                onChange={(url) => {
                                  const list = [...pageData.specialEvents]
                                  list[index] = { ...ev, image: url }
                                  setPageData({ ...pageData, specialEvents: list })
                                }}
                                placeholder="/images/fillerevents.jpg"
                                previewClassName="w-full h-32 object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const list = [...pageData.specialEvents]
                                list.splice(index, 1)
                                setPageData({ ...pageData, specialEvents: list })
                              }}
                            ><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                          </div>
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => setEventsTab('add')}
                        ><Plus className="w-4 h-4 mr-2" />Add Event</Button>
                      </div>
                    </div>
                  )}

                  {eventsTab === 'add' && (
                    <div className="space-y-4 border border-gray-200 p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <Input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="Event title" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <Input value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="March 31, 2024" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                          <Input value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} placeholder="9:00 AM & 11:00 AM" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <Input value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} placeholder="Venue details" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <Input value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} placeholder="Worship" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                          <Input value={newEvent.attendees} onChange={(e) => setNewEvent({ ...newEvent, attendees: e.target.value })} placeholder="350" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} rows={2} placeholder="Short description" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Image</label>
                          <ImageUpload
                            value={newEvent.image}
                            onChange={(url) => setNewEvent({ ...newEvent, image: url })}
                            placeholder="/images/fillerevents.jpg"
                            previewClassName="w-full h-32 object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const list = [...pageData.specialEvents, { ...newEvent, id: Date.now() }]
                            setPageData({ ...pageData, specialEvents: list })
                            setNewEvent({ id: 0, title: '', date: '', time: '', location: '', category: '', attendees: '', image: '/images/fillerevents.jpg', description: '', buttonText: 'Learn More', buttonLink: '#' })
                            setEventsTab('list')
                          }}
                        >Save Event</Button>
                        <Button variant="outline" onClick={() => setEventsTab('list')}>Cancel</Button>
                      </div>
                    </div>
                  )}
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
                  <h3 className="text-xl font-bold text-gray-900">Reflection Section</h3>
                  <p className="text-sm text-gray-500">Philosophical reflection with background image</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.reflection.title}
                    onChange={(e) => setPageData({ ...pageData, reflection: { ...pageData.reflection, title: e.target.value } })}
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
                    onChange={(url) => setPageData({ ...pageData, reflection: { ...pageData.reflection, backgroundImage: url } })}
                    placeholder="/images/carousel.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Event Categories Section */}
            <div id="categories-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Event Categories Section</h3>
                  <p className="text-sm text-gray-500">Event category cards</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.categoriesTitle}
                    onChange={(e) => setPageData({ ...pageData, categoriesTitle: e.target.value })}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <Input
                    value={pageData.categoriesSubtitle}
                    onChange={(e) => setPageData({ ...pageData, categoriesSubtitle: e.target.value })}
                    placeholder="Enter section subtitle"
                    className="w-full"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Category Cards</h4>
                  {pageData.categories.map((category, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category {index + 1} Title
                        </label>
                        <Input
                          value={category.title}
                          onChange={(e) => {
                            const newCategories = [...pageData.categories];
                            newCategories[index] = { ...category, title: e.target.value };
                            setPageData({ ...pageData, categories: newCategories });
                          }}
                          placeholder="Category title"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <Textarea
                          value={category.description}
                          onChange={(e) => {
                            const newCategories = [...pageData.categories];
                            newCategories[index] = { ...category, description: e.target.value };
                            setPageData({ ...pageData, categories: newCategories });
                          }}
                          placeholder="Category description"
                          rows={2}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

