'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Image as ImageIcon, Type, MousePointerClick, Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';
// Use server API for data load/save to avoid client Firestore transport issues

export default function HomePageEditor() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [eventsTab, setEventsTab] = useState<'list' | 'add'>('list');
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '/images/events.jpeg',
    isZoom: false as boolean,
    zoomLink: '' as string | undefined,
  });
  
  // All sections state
  const [pageData, setPageData] = useState({
    hero: {
      title: 'Experience the Power of Faith',
      subtitle: 'Join our vibrant community where modern worship meets timeless truth. Discover your purpose, grow in faith, and make lasting connections.',
      backgroundImage: '/images/bgimg.jpeg',
      primaryButtonText: 'Teachings',
      primaryButtonLink: '/teachings',
      secondaryButtonText: 'About',
      secondaryButtonLink: '/about',
    },
    whoWeAre: {
      description: 'We are a community based church with a keen interest in impacting our community through transformational Christ-centered activities and programs.',
      locationText: 'Delta Hotels Milton Keynes, Timbold Drive, Kents Hill, Milton Keynes, MK7 6HL, United Kingdom',
      serviceTimes: 'Sunday 11:00 AM, Tuesday 7:30 PM (Zoom), Thursday 7:00 PM (Zoom)',
      buttonText: 'Learn More',
      buttonLink: '/events',
      images: ['/images/rccg.JPG', '/images/2hgz.JPG', '/images/3hgz.png']
    },
    whatWeBelieve: {
      title: 'What We Believe',
      description: 'Our faith is grounded in the Bible and centered on Jesus Christ. We believe in the power of God\'s love to transform lives and communities.',
      backgroundImage: '/images/whoweare.jpg',
      buttonText: 'Learn More',
      buttonLink: '/about'
    },
    newToMilton: {
      title: 'New to Milton Keynes?',
      subtitle: 'Or Already Here, Visiting, and Looking to Connect?',
      description: 'If you are new to our community, visiting, or have been here for a while, we would love to share more about our church family and the ways you can get involved.',
      image: '/images/newtomilton.jpg',
      buttonText: 'Learn More',
      buttonLink: '/about'
    },
    practiceJesus: {
      title: 'Practice the way of Jesus',
      backgroundImage: '/images/followjesus.jpg',
      buttonText: 'Follow Jesus',
      buttonLink: '/follow-jesus'
    },
    ourServices: {
      description: 'Join us for worship, fellowship, and spiritual growth. We offer multiple service times to accommodate different schedules.',
      serviceTabs: [
        'Sunday Worship: 11:00 AM',
        'Tuesday House Fellowship & Bible Study: 7:30 PM (Zoom)',
        'Thursday Shiloh Hour: 7:00 PM (Zoom)',
        'Special events and community programs'
      ],
      backgroundImage: '/images/services.jpg',
      buttonText: 'View All Events',
      buttonLink: '/events'
    },
    events: {
      title: 'Upcoming Events',
      buttonText: 'View All Events',
      buttonLink: '/events',
      cardsPerView: { mobile: 1, tablet: 2, desktop: 3 }
    },
    eventsList: [
      {
        title: 'Sunday Worship',
        date: 'Every Sunday',
        time: '11:00 AM',
        location: 'Delta Hotels Milton Keynes',
        description: 'Join us for our main worship services. We gather to worship together, learn from Scripture, pray for one another, and create space to hear from the Spirit.',
        image: '/images/events.jpeg',
        isZoom: false
      },
    ],
    findUs: {
      address: 'Delta Hotels Milton Keynes, Timbold Drive, Kents Hill, Milton Keynes, MK7 6HL, United Kingdom',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2455.077566741137!2d-0.7015713!3d52.023684599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4877ab421b22b29f%3A0xc2a6c4e7f2bb1aa3!2sDelta%20Hotels%20Milton%20Keynes!5e0!3m2!1sen!2s!4v1760456046669!5m2!1sen!2s',
      phone: '+44 123 456 7890',
      email: 'info@holyghostzone.com',
      logo: ''
    }
  });

  // Load data from Firebase on mount
  useEffect(() => {
    loadPageData();
  }, []);

  // Track viewport width for preview consistency with homepage
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/home', { cache: 'no-store' });
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
      const res = await fetch('/api/admin/pages/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        })
      });
      if (!res.ok) throw new Error('Failed to save');
      
      alert('Changes saved successfully! Refresh the homepage to see your changes.');
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Home Page</h1>
                <p className="text-sm text-gray-500">Manage homepage content and components</p>
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
                 <a
                   href="#hero-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Hero Section
                 </a>
                 <a
                   href="#who-we-are-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Who We Are
                 </a>
                 <a
                   href="#what-we-believe-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   What We Believe
                 </a>
                 <a
                   href="#new-to-milton-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   New to Milton
                 </a>
                 <a
                   href="#practice-jesus-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Practice Jesus
                 </a>
                 <a
                   href="#our-services-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Our Services
                 </a>
                 <a
                   href="#events-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Events Section
                 </a>
                 <a
                   href="#find-us-section"
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border border-gray-200"
                 >
                   Find Us
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
                  <p className="text-sm text-gray-500">Main landing section with title and buttons</p>
                </div>
              </div>

              <div className="space-y-6">
                 {/* Title */}
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

                 {/* Subtitle */}
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

                 {/* Background Image */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     <ImageIcon className="w-4 h-4 inline mr-2" />
                     Background Image
                   </label>
                   <ImageUpload
                     value={pageData.hero.backgroundImage}
                     onChange={(url) => setPageData({ ...pageData, hero: { ...pageData.hero, backgroundImage: url }})}
                     placeholder="/images/bgimg.jpg"
                   />
                 </div>

                 {/* Primary Button */}
                 <div className="border-t border-gray-200 pt-6">
                   <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <MousePointerClick className="w-4 h-4" />
                     Primary Button
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Button Text
                       </label>
                       <Input
                         value={pageData.hero.primaryButtonText}
                         onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, primaryButtonText: e.target.value }})}
                         placeholder="Join Us"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Button Link
                       </label>
                       <Input
                         value={pageData.hero.primaryButtonLink}
                         onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, primaryButtonLink: e.target.value }})}
                         placeholder="/events"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Secondary Button */}
                 <div className="border-t border-gray-200 pt-6">
                   <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                     <MousePointerClick className="w-4 h-4" />
                     Secondary Button
                   </h4>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Button Text
                       </label>
                       <Input
                         value={pageData.hero.secondaryButtonText}
                         onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, secondaryButtonText: e.target.value }})}
                         placeholder="Learn More"
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Button Link
                       </label>
                       <Input
                         value={pageData.hero.secondaryButtonLink}
                         onChange={(e) => setPageData({ ...pageData, hero: { ...pageData.hero, secondaryButtonLink: e.target.value }})}
                         placeholder="/about"
                       />
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Who We Are Section */}
            <div id="who-we-are-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Who We Are Section</h3>
                  <p className="text-sm text-gray-500">Community description and location information</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={pageData.whoWeAre.description}
                    onChange={(e) => setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, description: e.target.value }})}
                    placeholder="Enter community description"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Text
                  </label>
                  <Input
                    value={pageData.whoWeAre.locationText}
                    onChange={(e) => setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, locationText: e.target.value }})}
                    placeholder="Enter location details"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Times
                  </label>
                  <Input
                    value={pageData.whoWeAre.serviceTimes}
                    onChange={(e) => setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, serviceTimes: e.target.value }})}
                    placeholder="e.g., Sunday 11:00 AM, Tuesday 7:30 PM"
                    className="w-full"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.whoWeAre.buttonText}
                        onChange={(e) => setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, buttonText: e.target.value }})}
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.whoWeAre.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, buttonLink: e.target.value }})}
                        placeholder="/events"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Images (3 images)
                  </label>
                  {pageData.whoWeAre.images.map((image, index) => (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Image {index + 1}
                      </label>
                      <ImageUpload
                        value={image}
                        onChange={(url) => {
                          const newImages = [...pageData.whoWeAre.images];
                          newImages[index] = url;
                          setPageData({ ...pageData, whoWeAre: { ...pageData.whoWeAre, images: newImages }});
                        }}
                        placeholder={`/images/image${index + 1}.jpg`}
                        previewClassName="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What We Believe Section */}
            <div id="what-we-believe-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">What We Believe Section</h3>
                  <p className="text-sm text-gray-500">Faith beliefs and background image</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.whatWeBelieve.title}
                    onChange={(e) => setPageData({ ...pageData, whatWeBelieve: { ...pageData.whatWeBelieve, title: e.target.value }})}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={pageData.whatWeBelieve.description}
                    onChange={(e) => setPageData({ ...pageData, whatWeBelieve: { ...pageData.whatWeBelieve, description: e.target.value }})}
                    placeholder="Enter belief description"
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
                    value={pageData.whatWeBelieve.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, whatWeBelieve: { ...pageData.whatWeBelieve, backgroundImage: url }})}
                    placeholder="/images/whoweare.jpg"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.whatWeBelieve.buttonText}
                        onChange={(e) => setPageData({ ...pageData, whatWeBelieve: { ...pageData.whatWeBelieve, buttonText: e.target.value }})}
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.whatWeBelieve.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, whatWeBelieve: { ...pageData.whatWeBelieve, buttonLink: e.target.value }})}
                        placeholder="/about"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* New to Milton Section */}
            <div id="new-to-milton-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">New to Milton Section</h3>
                  <p className="text-sm text-gray-500">Welcome message for new community members</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.newToMilton.title}
                    onChange={(e) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, title: e.target.value }})}
                    placeholder="Enter main title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={pageData.newToMilton.subtitle}
                    onChange={(e) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, subtitle: e.target.value }})}
                    placeholder="Enter subtitle"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={pageData.newToMilton.description}
                    onChange={(e) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, description: e.target.value }})}
                    placeholder="Enter welcome message"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Main Image
                  </label>
                  <ImageUpload
                    value={pageData.newToMilton.image}
                    onChange={(url) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, image: url }})}
                    placeholder="/images/newtomilton.jpg"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.newToMilton.buttonText}
                        onChange={(e) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, buttonText: e.target.value }})}
                        placeholder="Learn More"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.newToMilton.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, newToMilton: { ...pageData.newToMilton, buttonLink: e.target.value }})}
                        placeholder="/about"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practice the Way of Jesus Section */}
            <div id="practice-jesus-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Practice the Way of Jesus Section</h3>
                  <p className="text-sm text-gray-500">Spiritual journey and background image</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Input
                    value={pageData.practiceJesus.title}
                    onChange={(e) => setPageData({ ...pageData, practiceJesus: { ...pageData.practiceJesus, title: e.target.value }})}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Background Image
                  </label>
                  <ImageUpload
                    value={pageData.practiceJesus.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, practiceJesus: { ...pageData.practiceJesus, backgroundImage: url }})}
                    placeholder="/images/followjesus.jpg"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.practiceJesus.buttonText}
                        onChange={(e) => setPageData({ ...pageData, practiceJesus: { ...pageData.practiceJesus, buttonText: e.target.value }})}
                        placeholder="Follow Jesus"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.practiceJesus.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, practiceJesus: { ...pageData.practiceJesus, buttonLink: e.target.value }})}
                        placeholder="/follow-jesus"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Our Services Section */}
            <div id="our-services-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-teal-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Our Services Section</h3>
                  <p className="text-sm text-gray-500">Service times and worship information</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={pageData.ourServices.description}
                    onChange={(e) => setPageData({ ...pageData, ourServices: { ...pageData.ourServices, description: e.target.value }})}
                    placeholder="Enter services description"
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
                    value={pageData.ourServices.backgroundImage}
                    onChange={(url) => setPageData({ ...pageData, ourServices: { ...pageData.ourServices, backgroundImage: url }})}
                    placeholder="/images/services.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Tabs (4 services)
                  </label>
                  {pageData.ourServices.serviceTabs.map((tab, index) => (
                    <div key={index} className="mb-3">
                      <Input
                        value={tab}
                        onChange={(e) => {
                          const newTabs = [...pageData.ourServices.serviceTabs];
                          newTabs[index] = e.target.value;
                          setPageData({ ...pageData, ourServices: { ...pageData.ourServices, serviceTabs: newTabs }});
                        }}
                        placeholder={`Service ${index + 1} - e.g., Sunday Worship: 11:00 AM`}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.ourServices.buttonText}
                        onChange={(e) => setPageData({ ...pageData, ourServices: { ...pageData.ourServices, buttonText: e.target.value }})}
                        placeholder="View All Events"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.ourServices.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, ourServices: { ...pageData.ourServices, buttonLink: e.target.value }})}
                        placeholder="/events"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div id="events-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Events Section</h3>
                  <p className="text-sm text-gray-500">Upcoming events section header</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <Input
                    value={pageData.events.title}
                    onChange={(e) => setPageData({ ...pageData, events: { ...pageData.events, title: e.target.value }})}
                    placeholder="Enter section title"
                    className="w-full"
                  />
                </div>

                {/* Cards per view */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['mobile','tablet','desktop'] as const).map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cards per view ({key})
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={6}
                        value={pageData.events.cardsPerView?.[key] ?? (key==='mobile'?1:key==='tablet'?2:3)}
                        onChange={(e) => setPageData({
                          ...pageData,
                          events: {
                            ...pageData.events,
                            cardsPerView: {
                              mobile: key==='mobile' ? Number(e.target.value) : (pageData.events.cardsPerView?.mobile ?? 1),
                              tablet: key==='tablet' ? Number(e.target.value) : (pageData.events.cardsPerView?.tablet ?? 2),
                              desktop: key==='desktop' ? Number(e.target.value) : (pageData.events.cardsPerView?.desktop ?? 3),
                            }
                          }
                        })}
                        placeholder={key==='mobile' ? '1' : key==='tablet' ? '2' : '3'}
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MousePointerClick className="w-4 h-4" />
                    Call-to-Action Button
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <Input
                        value={pageData.events.buttonText}
                        onChange={(e) => setPageData({ ...pageData, events: { ...pageData.events, buttonText: e.target.value }})}
                        placeholder="View All Events"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <Input
                        value={pageData.events.buttonLink}
                        onChange={(e) => setPageData({ ...pageData, events: { ...pageData.events, buttonLink: e.target.value }})}
                        placeholder="/events"
                      />
                    </div>
                  </div>
                </div>

                {/* Events Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MousePointerClick className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-900 mb-1">Events are now managed centrally</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          All events displayed on the home page are pulled from the Events page. Manage them there to keep everything in sync.
                        </p>
                        <Link href="/admin/dashboard/pages/events">
                          <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                            Go to Events Page →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legacy Events Tabs - Hidden but keeping data structure */}
                  <div className="hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        className={`px-3 py-1.5 text-sm border ${eventsTab==='list' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                        onClick={() => setEventsTab('list')}
                      >Events List</button>
                      <button
                        className={`px-3 py-1.5 text-sm border ${eventsTab==='add' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300'}`}
                        onClick={() => setEventsTab('add')}
                      >Add New Event</button>
                    </div>

                    {eventsTab === 'list' && (
                      <div className="space-y-6">
                        {(pageData.eventsList || []).map((ev, index) => (
                        <div key={index} className="p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="text-sm font-semibold text-gray-900">Event {index + 1}</h5>
                            <span className="text-xs text-gray-500">{ev.isZoom ? 'Zoom' : 'In-person'}</span>
                          </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <Input
                              value={ev.title}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, title: e.target.value }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="Event title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <Input
                              value={ev.date}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, date: e.target.value }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="e.g., Every Sunday or 2025-02-01"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <Input
                              value={ev.time}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, time: e.target.value }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="e.g., 11:00 AM"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <Input
                              value={ev.location}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, location: e.target.value }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="Location or Zoom meeting details"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <Textarea
                              value={ev.description}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, description: e.target.value }
                                setPageData({ ...pageData, eventsList: list })
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
                                const list = [...pageData.eventsList]
                                list[index] = { ...ev, image: url }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="/images/events.jpeg"
                              previewClassName="w-full h-32 object-cover"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Link (optional)</label>
                            <Input
                              value={ev.zoomLink || ''}
                              onChange={(e) => {
                                const list = [...pageData.eventsList]
                                const val = e.target.value
                                list[index] = { ...ev, zoomLink: val, isZoom: !!val }
                                setPageData({ ...pageData, eventsList: list })
                              }}
                              placeholder="https://zoom.us/j/..."
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const list = [...pageData.eventsList]
                              list.splice(index, 1)
                              setPageData({ ...pageData, eventsList: list })
                            }}
                          >Remove</Button>
                        </div>
                        </div>
                      ))}
                      <div>
                        <Button
                          variant="outline"
                          onClick={() => setEventsTab('add')}
                        >Add Event</Button>
                      </div>
                    </div>
                  )}

                  {eventsTab === 'add' && (
                    <div className="space-y-4 border border-gray-200 p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <Input value={newEvent.title} onChange={(e)=>setNewEvent({...newEvent,title:e.target.value})} placeholder="Event title" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                          <Input value={newEvent.date} onChange={(e)=>setNewEvent({...newEvent,date:e.target.value})} placeholder="Every Sunday or 2025-02-01" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                          <Input value={newEvent.time} onChange={(e)=>setNewEvent({...newEvent,time:e.target.value})} placeholder="11:00 AM" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                          <Input value={newEvent.location} onChange={(e)=>setNewEvent({...newEvent,location:e.target.value})} placeholder="Venue or Zoom details" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <Textarea value={newEvent.description} onChange={(e)=>setNewEvent({...newEvent,description:e.target.value})} rows={2} placeholder="Short description" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2"><ImageIcon className="w-4 h-4 inline mr-2" />Image</label>
                          <ImageUpload
                            value={newEvent.image}
                            onChange={(url)=>setNewEvent({...newEvent,image:url})}
                            placeholder="/images/events.jpeg"
                            previewClassName="w-full h-32 object-cover"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Zoom Link (optional)</label>
                          <Input value={newEvent.zoomLink || ''} onChange={(e)=>setNewEvent({...newEvent,zoomLink:e.target.value,isZoom:!!e.target.value})} placeholder="https://zoom.us/j/..." />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={()=>{
                            const list = [...pageData.eventsList, newEvent]
                            setPageData({...pageData, eventsList: list})
                            setNewEvent({ title:'', date:'', time:'', location:'', description:'', image:'/images/events.jpeg', isZoom:false, zoomLink:'' })
                            setEventsTab('list')
                          }}
                        >Save Event</Button>
                        <Button variant="outline" onClick={()=>setEventsTab('list')}>Cancel</Button>
                      </div>
                    </div>
                  )}
                    </div>
                  </div>

                {/* Live Preview - matches homepage behavior */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Preview (current viewport)</h4>
                  {(() => {
                    const isMobile = windowWidth < 768
                    const isTablet = windowWidth >= 768 && windowWidth < 1024
                    const cards = isMobile
                      ? (pageData.events.cardsPerView?.mobile ?? 1)
                      : isTablet
                        ? (pageData.events.cardsPerView?.tablet ?? 2)
                        : (pageData.events.cardsPerView?.desktop ?? 3)
                    const fallback = [
                      {
                        title: 'Sunday Worship',
                        date: 'Every Sunday',
                        time: '11:00 AM',
                        location: 'Delta Hotels Milton Keynes',
                        description: 'Join us for our main worship services. We gather to worship together... ',
                        image: '/images/events.jpeg',
                        isZoom: false,
                      },
                      {
                        title: 'Tuesday House Fellowship & Bible Study',
                        date: 'Every Tuesday',
                        time: '7:30 PM',
                        location: 'Meeting ID: 858 914 272 | Passcode: 141507',
                        description: 'Mid-week house fellowship and Bible study sessions...',
                        image: '/images/events.jpeg',
                        isZoom: true,
                        zoomLink: 'https://zoom.us/j/858914272#success'
                      },
                      {
                        title: 'Thursday Shiloh Hour',
                        date: 'Every Thursday',
                        time: '7:00 PM',
                        location: 'Meeting ID: 858 914 272 | Passcode: 141507',
                        description: 'Join us online for the Shiloh Hour...',
                        image: '/images/events.jpeg',
                        isZoom: true,
                        zoomLink: 'https://zoom.us/j/858914272#success'
                      }
                    ]
                    const list = (pageData.eventsList && pageData.eventsList.length > 0) ? pageData.eventsList : fallback
                    const visible = list.slice(0, Math.max(1, cards))
                    return (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Showing {visible.length} of {list.length} events (cards per view = {cards})</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {visible.map((ev, idx) => (
                            <div key={idx} className="border border-gray-200 p-3">
                              <div className="aspect-[4/3] rounded bg-gray-100 overflow-hidden mb-2">
                                <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="text-sm font-semibold text-gray-900 line-clamp-2">{ev.title}</div>
                              <div className="text-xs text-gray-600">{ev.date} • {ev.time}</div>
                              <div className="text-xs text-gray-600 line-clamp-1">{ev.location}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Find Us Section */}
            <div id="find-us-section" className="bg-white border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center">
                  <Type className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Find Us Section</h3>
                  <p className="text-sm text-gray-500">Location and contact information</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4 inline mr-2" />
                    Location Logo
                  </label>
                  <ImageUpload
                    value={pageData.findUs.logo || ''}
                    onChange={(url) => setPageData({ ...pageData, findUs: { ...pageData.findUs, logo: url }})}
                    placeholder="/images/holy-ghost-zone-logo.png"
                    previewClassName="w-full h-32 object-contain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <Textarea
                    value={pageData.findUs.address}
                    onChange={(e) => setPageData({ ...pageData, findUs: { ...pageData.findUs, address: e.target.value }})}
                    placeholder="Enter full address"
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Embed URL
                  </label>
                  <Input
                    value={pageData.findUs.mapUrl}
                    onChange={(e) => setPageData({ ...pageData, findUs: { ...pageData.findUs, mapUrl: e.target.value }})}
                    placeholder="Paste Google Maps embed URL here"
                    className="w-full"
                  />
                  {pageData.findUs.mapUrl && (
                    <div className="mt-3 border border-gray-200 p-2">
                      <iframe
                        src={pageData.findUs.mapUrl}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={pageData.findUs.phone}
                    onChange={(e) => setPageData({ ...pageData, findUs: { ...pageData.findUs, phone: e.target.value }})}
                    placeholder="e.g., +44 123 456 7890"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    value={pageData.findUs.email}
                    onChange={(e) => setPageData({ ...pageData, findUs: { ...pageData.findUs, email: e.target.value }})}
                    placeholder="e.g., info@holyghostzone.com"
                    className="w-full"
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

