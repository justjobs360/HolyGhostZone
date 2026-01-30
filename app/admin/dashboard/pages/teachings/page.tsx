'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image as ImageIcon, Type, Loader2, Plus, Trash2, Video, Music, Link as LinkIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

export default function TeachingsPageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [teachingsTab, setTeachingsTab] = useState<'list' | 'add'>('list');
  const [seriesTab, setSeriesTab] = useState<'list' | 'add'>('list');
  const [newTeaching, setNewTeaching] = useState({
    id: 0,
    title: '',
    speaker: '',
    date: '',
    duration: '',
    series: '',
    thumbnail: '/pastor-preaching-faith-sermon.jpg',
    description: '',
    videoUrl: '',
    audioUrl: '',
    buttonText: 'Watch Now',
    buttonLink: '',
  });
  const [newSeries, setNewSeries] = useState({
    title: '',
    description: '',
    lessons: '',
    image: '/pastor-preaching-faith-sermon.jpg',
  });
  
  // All sections state
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Teachings & Sermons',
      subtitle: 'Dive deeper into God\'s Word with our collection of inspiring messages, practical teachings, and transformative biblical insights.',
      backgroundImage: '/pastor-preaching-faith-sermon.jpg'
    },
    recentTitle: 'Recent Messages',
    recentSubtitle: 'Catch up on our latest Sunday messages and special teachings',
    reflection: {
      title: 'What If Truth Transforms You?',
      backgroundImage: '/purpose-calling-ministry-teaching.jpg'
    },
    seriesTitle: 'Teaching Series',
    seriesSubtitle: 'Explore our comprehensive teaching series on various biblical topics',
    resourcesTitle: 'Additional Resources',
    resourcesSubtitle: 'Tools and materials to support your spiritual growth and study',
    recentTeachings: [
      {
        id: 1,
        title: 'Walking in Faith',
        speaker: 'Pastor John Smith',
        date: 'March 10, 2024',
        duration: '45 min',
        series: 'Foundations of Faith',
        thumbnail: '/pastor-preaching-faith-sermon.jpg',
        description: 'Discover what it means to live by faith and trust God\'s plan for your life, even in uncertain times.',
        videoUrl: '',
        audioUrl: '',
        buttonText: 'Watch Now',
        buttonLink: '',
      }
    ],
    teachingSeries: [
      {
        title: 'Foundations of Faith',
        description: 'Essential truths for every believer\'s spiritual journey',
        lessons: '8',
        image: '/pastor-preaching-faith-sermon.jpg'
      }
    ],
    resources: [
      {
        icon: 'BookOpen',
        title: 'Study Guides',
        description: 'Downloadable guides to accompany our teaching series'
      },
      {
        icon: 'Download',
        title: 'Audio Downloads',
        description: 'Take our messages with you wherever you go'
      },
      {
        icon: 'Play',
        title: 'Video Library',
        description: 'Complete archive of all our recorded teachings'
      }
    ]
  });

  // Load data from Firebase on mount
  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/teachings', { cache: 'no-store' });
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
      const res = await fetch('/api/admin/pages/teachings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      alert('Changes saved successfully! Refresh the teachings page to see your changes.');
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Teachings Page</h1>
                <p className="text-sm text-gray-500">Manage teachings page content and components</p>
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
                <a href="#recent-teachings-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Recent Teachings
                </a>
                <a href="#reflection-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Reflection Section
                </a>
                <a href="#teaching-series-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Teaching Series
                </a>
                <a href="#resources-section" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200">
                  Resources
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
                    placeholder="/pastor-preaching-faith-sermon.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Recent Teachings Section */}
            <div id="recent-teachings-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Teachings Section</h3>
                  <p className="text-sm text-gray-500">Latest messages and teachings</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.recentTitle}
                    onChange={(e) => setPageData({ ...pageData, recentTitle: e.target.value })}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <Input
                    value={pageData.recentSubtitle}
                    onChange={(e) => setPageData({ ...pageData, recentSubtitle: e.target.value })}
                    placeholder="Enter section subtitle"
                    className="w-full"
                  />
                </div>

                {/* Teachings Tabs */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      className={`px-3 py-1.5 text-sm border ${teachingsTab==='list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setTeachingsTab('list')}
                    >Teachings List</button>
                    <button
                      className={`px-3 py-1.5 text-sm border ${teachingsTab==='add' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setTeachingsTab('add')}
                    >Add New Teaching</button>
                  </div>

                  {teachingsTab === 'list' && (
                    <div className="space-y-6">
                      {pageData.recentTeachings.map((teaching, index) => (
                        <div key={index} className="p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900">Teaching {index + 1}</h5>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                              <Input
                                value={teaching.title}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, title: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="Teaching title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                              <Input
                                value={teaching.speaker}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, speaker: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="Speaker name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                              <Input
                                value={teaching.date}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, date: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="e.g., March 10, 2024"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                              <Input
                                value={teaching.duration}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, duration: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="e.g., 45 min"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Series</label>
                              <Input
                                value={teaching.series}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, series: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="Teaching series"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Thumbnail</label>
                              <ImageUpload
                                value={teaching.thumbnail}
                                onChange={(url) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, thumbnail: url }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="/pastor-preaching-faith-sermon.jpg"
                                previewClassName="w-full h-32 object-cover"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <Textarea
                                value={teaching.description}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, description: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="Short description"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><Video className="w-4 h-4 inline mr-2" />Video URL (YouTube, Vimeo, or direct link)</label>
                              <ImageUpload
                                value={teaching.videoUrl || ''}
                                onChange={(url) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, videoUrl: url }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="https://youtube.com/watch?v=... or /api/images/..."
                                accept="video/*"
                                label="Video"
                                previewClassName="w-full h-32 object-contain"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><Music className="w-4 h-4 inline mr-2" />Audio URL (MP3 or direct link)</label>
                              <ImageUpload
                                value={teaching.audioUrl || ''}
                                onChange={(url) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, audioUrl: url }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="https://... or /api/images/..."
                                accept="audio/*"
                                label="Audio"
                                previewClassName="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><LinkIcon className="w-4 h-4 inline mr-2" />Button Text</label>
                              <Input
                                value={teaching.buttonText || 'Watch Now'}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, buttonText: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="Watch Now"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><LinkIcon className="w-4 h-4 inline mr-2" />Button Link (optional - overrides video/audio)</label>
                              <Input
                                value={teaching.buttonLink || ''}
                                onChange={(e) => {
                                  const list = [...pageData.recentTeachings]
                                  list[index] = { ...teaching, buttonLink: e.target.value }
                                  setPageData({ ...pageData, recentTeachings: list })
                                }}
                                placeholder="https://external-link.com or leave empty to use video/audio"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const list = [...pageData.recentTeachings]
                                list.splice(index, 1)
                                setPageData({ ...pageData, recentTeachings: list })
                              }}
                            ><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                          </div>
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => setTeachingsTab('add')}
                        ><Plus className="w-4 h-4 mr-2" />Add Teaching</Button>
                      </div>
                    </div>
                  )}

                  {teachingsTab === 'add' && (
                    <div className="space-y-4 border border-gray-200 p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <Input value={newTeaching.title} onChange={(e)=>setNewTeaching({...newTeaching,title:e.target.value})} placeholder="Teaching title" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
                          <Input value={newTeaching.speaker} onChange={(e)=>setNewTeaching({...newTeaching,speaker:e.target.value})} placeholder="Speaker name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <Input value={newTeaching.date} onChange={(e)=>setNewTeaching({...newTeaching,date:e.target.value})} placeholder="March 10, 2024" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                          <Input value={newTeaching.duration} onChange={(e)=>setNewTeaching({...newTeaching,duration:e.target.value})} placeholder="45 min" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Series</label>
                          <Input value={newTeaching.series} onChange={(e)=>setNewTeaching({...newTeaching,series:e.target.value})} placeholder="Teaching series" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Thumbnail</label>
                          <ImageUpload
                            value={newTeaching.thumbnail}
                            onChange={(url)=>setNewTeaching({...newTeaching,thumbnail:url})}
                            placeholder="/pastor-preaching-faith-sermon.jpg"
                            previewClassName="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Textarea value={newTeaching.description} onChange={(e)=>setNewTeaching({...newTeaching,description:e.target.value})} rows={2} placeholder="Short description" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><Video className="w-4 h-4 inline mr-2" />Video URL (YouTube, Vimeo, or direct link)</label>
                          <ImageUpload
                            value={newTeaching.videoUrl || ''}
                            onChange={(url)=>setNewTeaching({...newTeaching,videoUrl:url})}
                            placeholder="https://youtube.com/watch?v=... or /api/images/..."
                            accept="video/*"
                            label="Video"
                            previewClassName="w-full h-32 object-contain"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><Music className="w-4 h-4 inline mr-2" />Audio URL (MP3 or direct link)</label>
                          <ImageUpload
                            value={newTeaching.audioUrl || ''}
                            onChange={(url)=>setNewTeaching({...newTeaching,audioUrl:url})}
                            placeholder="https://... or /api/images/..."
                            accept="audio/*"
                            label="Audio"
                            previewClassName="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><LinkIcon className="w-4 h-4 inline mr-2" />Button Text</label>
                          <Input value={newTeaching.buttonText || 'Watch Now'} onChange={(e)=>setNewTeaching({...newTeaching,buttonText:e.target.value})} placeholder="Watch Now" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><LinkIcon className="w-4 h-4 inline mr-2" />Button Link (optional - overrides video/audio)</label>
                          <Input value={newTeaching.buttonLink || ''} onChange={(e)=>setNewTeaching({...newTeaching,buttonLink:e.target.value})} placeholder="https://external-link.com or leave empty" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={()=>{
                            const list = [...pageData.recentTeachings, { ...newTeaching, id: Date.now() }]
                            setPageData({...pageData, recentTeachings: list})
                            setNewTeaching({ id: 0, title:'', speaker:'', date:'', duration:'', series:'', thumbnail:'/pastor-preaching-faith-sermon.jpg', description:'', videoUrl:'', audioUrl:'', buttonText:'Watch Now', buttonLink:'' })
                            setTeachingsTab('list')
                          }}
                        >Save Teaching</Button>
                        <Button variant="outline" onClick={()=>setTeachingsTab('list')}>Cancel</Button>
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
                    placeholder="/purpose-calling-ministry-teaching.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Teaching Series Section */}
            <div id="teaching-series-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Teaching Series Section</h3>
                  <p className="text-sm text-gray-500">Teaching series collection</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.seriesTitle}
                    onChange={(e) => setPageData({ ...pageData, seriesTitle: e.target.value })}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <Input
                    value={pageData.seriesSubtitle}
                    onChange={(e) => setPageData({ ...pageData, seriesSubtitle: e.target.value })}
                    placeholder="Enter section subtitle"
                    className="w-full"
                  />
                </div>

                {/* Series Tabs */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      className={`px-3 py-1.5 text-sm border ${seriesTab==='list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setSeriesTab('list')}
                    >Series List</button>
                    <button
                      className={`px-3 py-1.5 text-sm border ${seriesTab==='add' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                      onClick={() => setSeriesTab('add')}
                    >Add New Series</button>
                  </div>

                  {seriesTab === 'list' && (
                    <div className="space-y-6">
                      {pageData.teachingSeries.map((series, index) => (
                        <div key={index} className="p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900">Series {index + 1}</h5>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                              <Input
                                value={series.title}
                                onChange={(e) => {
                                  const list = [...pageData.teachingSeries]
                                  list[index] = { ...series, title: e.target.value }
                                  setPageData({ ...pageData, teachingSeries: list })
                                }}
                                placeholder="Series title"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Lessons</label>
                              <Input
                                value={series.lessons}
                                onChange={(e) => {
                                  const list = [...pageData.teachingSeries]
                                  list[index] = { ...series, lessons: e.target.value }
                                  setPageData({ ...pageData, teachingSeries: list })
                                }}
                                placeholder="e.g., 8"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <Textarea
                                value={series.description}
                                onChange={(e) => {
                                  const list = [...pageData.teachingSeries]
                                  list[index] = { ...series, description: e.target.value }
                                  setPageData({ ...pageData, teachingSeries: list })
                                }}
                                placeholder="Series description"
                                rows={2}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Image</label>
                              <ImageUpload
                                value={series.image}
                                onChange={(url) => {
                                  const list = [...pageData.teachingSeries]
                                  list[index] = { ...series, image: url }
                                  setPageData({ ...pageData, teachingSeries: list })
                                }}
                                placeholder="/pastor-preaching-faith-sermon.jpg"
                                previewClassName="w-full h-32 object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-3">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const list = [...pageData.teachingSeries]
                                list.splice(index, 1)
                                setPageData({ ...pageData, teachingSeries: list })
                              }}
                            ><Trash2 className="w-4 h-4 mr-2" />Remove</Button>
                          </div>
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => setSeriesTab('add')}
                        ><Plus className="w-4 h-4 mr-2" />Add Series</Button>
                      </div>
                    </div>
                  )}

                  {seriesTab === 'add' && (
                    <div className="space-y-4 border border-gray-200 p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <Input value={newSeries.title} onChange={(e)=>setNewSeries({...newSeries,title:e.target.value})} placeholder="Series title" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Lessons</label>
                          <Input value={newSeries.lessons} onChange={(e)=>setNewSeries({...newSeries,lessons:e.target.value})} placeholder="8" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Textarea value={newSeries.description} onChange={(e)=>setNewSeries({...newSeries,description:e.target.value})} rows={2} placeholder="Series description" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Image</label>
                          <ImageUpload
                            value={newSeries.image}
                            onChange={(url)=>setNewSeries({...newSeries,image:url})}
                            placeholder="/pastor-preaching-faith-sermon.jpg"
                            previewClassName="w-full h-32 object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={()=>{
                            const list = [...pageData.teachingSeries, { ...newSeries }]
                            setPageData({...pageData, teachingSeries: list})
                            setNewSeries({ title:'', description:'', lessons:'', image:'/pastor-preaching-faith-sermon.jpg' })
                            setSeriesTab('list')
                          }}
                        >Save Series</Button>
                        <Button variant="outline" onClick={()=>setSeriesTab('list')}>Cancel</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div id="resources-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Resources Section</h3>
                  <p className="text-sm text-gray-500">Additional resource cards</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.resourcesTitle}
                    onChange={(e) => setPageData({ ...pageData, resourcesTitle: e.target.value })}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Subtitle
                  </label>
                  <Input
                    value={pageData.resourcesSubtitle}
                    onChange={(e) => setPageData({ ...pageData, resourcesSubtitle: e.target.value })}
                    placeholder="Enter section subtitle"
                    className="w-full"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Resource Cards</h4>
                  {pageData.resources.map((resource, index) => (
                    <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resource {index + 1} Title
                        </label>
                        <Input
                          value={resource.title}
                          onChange={(e) => {
                            const newResources = [...pageData.resources];
                            newResources[index] = { ...resource, title: e.target.value };
                            setPageData({ ...pageData, resources: newResources });
                          }}
                          placeholder="Resource title"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <Textarea
                          value={resource.description}
                          onChange={(e) => {
                            const newResources = [...pageData.resources];
                            newResources[index] = { ...resource, description: e.target.value };
                            setPageData({ ...pageData, resources: newResources });
                          }}
                          placeholder="Resource description"
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

