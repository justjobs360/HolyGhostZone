'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import Link from 'next/link';

const DEFAULT_STEPS = [
  { title: 'Acknowledge all your sins Acts 2:36 - 38', content: 'Therefore let all the house of Israel know assuredly, that God hath made the same Jesus, whom ye have crucified, both Lord and Christ. 37 Now when they heard this, they were pricked in their heart, and said unto Peter and to the rest of the apostles, Men and brethren, what shall we do? 38 Then Peter said unto them, Repent, and be baptized every one of you in the name of Jesus Christ for the remission of sins, and ye shall receive the gift of the Holy Ghost.' },
  { title: 'Confess those sins. Galatians 5:19 - 21', content: 'Now the works of the flesh are manifest, which are these; Adultery, fornication, uncleanness, lasciviousness, Idolatry, witchcraft, hatred, variance, emulations, wrath, strife, seditions, heresies, Envyings, murders, drunkenness, revellings, and such like: of the which I tell you before, as I have also told you in time past, that they which do such things shall not inherit the kingdom of God.' },
  { title: 'Ask for forgiveness of sin. I John 1:9', content: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.' },
  { title: 'Repent of those sins. Act 3:19', content: 'Repent ye therefore, and be converted, that your sins may be blotted out, when the times of refreshing shall come from the presence of the Lord.' },
  { title: 'Forsake all your old ways and sinful habit Luke 14: 33', content: 'So likewise, whosoever he be of you that forsaketh not all that he hath, he cannot be my disciple.' },
  { title: 'Join a Bible believing Church around. Hebrew 10:25', content: 'Not forsaking the assembling of ourselves together, as the manner of some is; but exhorting one another: and so much the more, as ye see the day approaching.' },
];

export default function FollowJesusPageEditor() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState({
    title: 'Do You Want To Give Your Life To Christ?',
    subtitle: 'Please Follow The Steps Below.',
    backgroundImage: '/images/services.jpg',
    steps: DEFAULT_STEPS,
  });

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const res = await fetch('/api/admin/pages/follow-jesus', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      if (Object.keys(data).length > 0) {
        setPageData((prev) => ({
          ...prev,
          ...data,
          steps: Array.isArray(data.steps) && data.steps.length > 0 ? data.steps : prev.steps,
        }));
      }
    } catch (error) {
      console.error('Error loading follow-jesus page data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/pages/follow-jesus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pageData,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('Failed to save');
      alert('Changes saved successfully! Refresh the Follow Jesus page to see your changes.');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStep = (index: number, field: 'title' | 'content', value: string) => {
    const next = [...pageData.steps];
    next[index] = { ...next[index], [field]: value };
    setPageData({ ...pageData, steps: next });
  };

  const addStep = () => {
    setPageData({
      ...pageData,
      steps: [...pageData.steps, { title: '', content: '' }],
    });
  };

  const removeStep = (index: number) => {
    if (pageData.steps.length <= 1) return;
    const next = pageData.steps.filter((_, i) => i !== index);
    setPageData({ ...pageData, steps: next });
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Follow Jesus Page</h1>
                <p className="text-sm text-gray-500">Manage /follow-jesus page content and steps</p>
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
          {/* Page title & subtitle */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Page heading</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={pageData.title}
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  placeholder="Do You Want To Give Your Life To Christ?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <Input
                  value={pageData.subtitle}
                  onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                  placeholder="Please Follow The Steps Below."
                />
              </div>
            </div>
          </div>

          {/* Background image */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-50 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Background image</h3>
                <p className="text-sm text-gray-500">Image behind the steps section</p>
              </div>
            </div>
            <ImageUpload
              value={pageData.backgroundImage}
              onChange={(url) => setPageData({ ...pageData, backgroundImage: url })}
              placeholder="/images/services.jpg"
              previewClassName="w-full h-40 object-cover"
            />
          </div>

          {/* Steps */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Steps</h3>
                <p className="text-sm text-gray-500">Accordion steps shown on the Follow Jesus page</p>
              </div>
              <Button type="button" variant="outline" onClick={addStep} className="gap-2">
                <Plus className="w-4 h-4" />
                Add step
              </Button>
            </div>
            <div className="space-y-6">
              {pageData.steps.map((step, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(index)}
                      disabled={pageData.steps.length <= 1}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(index, 'title', e.target.value)}
                      placeholder="Step title (e.g. with scripture reference)"
                    />
                    <Textarea
                      value={step.content}
                      onChange={(e) => updateStep(index, 'content', e.target.value)}
                      placeholder="Step content / scripture text"
                      rows={4}
                      className="resize-y"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
