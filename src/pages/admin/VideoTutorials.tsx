import React, { useEffect, useState } from 'react';
import { firestore, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Save, Video, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { FileUploader } from '@/components/ui/file-uploader';
import ReactMarkdown from 'react-markdown';

interface VideoTutorial {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'upload';
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishDate?: Date;
  metaDescription: string;
  readingLevel: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
  videoSource: 'upload' | 'embed';
  thumbnailUrl: string;
  captions: {url: string, lang: string, name: string}[];
  transcript: string;
  estimatedWatchTime: number;
  prerequisites: string[];
  visibility: 'public' | 'unlisted' | 'private';
}

export default function VideoTutorials() {
  const [tutorials, setTutorials] = useState<VideoTutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [categories, setCategories] = useState(['bootcamp', 'dsa', 'projects']);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<Partial<VideoTutorial>>({
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    videoType: 'youtube',
    category: '',
    tags: [],
    status: 'draft',
    metaDescription: '',
    readingLevel: 'easy',
    videoSource: 'upload',
    thumbnailUrl: '',
    captions: [],
    transcript: '',
    estimatedWatchTime: 0,
    prerequisites: [],
    visibility: 'public',
  });
  const { toast } = useToast();

  // Helper for uploading a file to Firebase Storage
  async function uploadFileToStorage(file, folder = 'video-tutorials') {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  const fetchTutorials = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(firestore, 'videoTutorials'));
      setTutorials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoTutorial)));
    } catch (err) {
      setError('Failed to load video tutorials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video tutorial?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(firestore, 'videoTutorials', id));
      await fetchTutorials();
      toast({ title: 'Success', description: 'Video tutorial deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete video tutorial', variant: 'destructive' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!currentTutorial.title || currentTutorial.title.length < 5) {
      toast({ title: 'Validation Error', description: 'Title must be at least 5 characters long', variant: 'destructive' });
      return;
    }
    if (!currentTutorial.videoUrl) {
      toast({ title: 'Validation Error', description: 'Video is required', variant: 'destructive' });
      return;
    }
    try {
      if (editId) {
        await updateDoc(doc(firestore, 'videoTutorials', editId), {
          ...currentTutorial,
          updatedAt: new Date(),
        });
        toast({ title: 'Success', description: 'Video tutorial updated successfully' });
      } else {
        await addDoc(collection(firestore, 'videoTutorials'), {
          ...currentTutorial,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast({ title: 'Success', description: 'Video tutorial created successfully' });
      }
      setIsAddModalOpen(false);
      setEditId(null);
      fetchTutorials();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save video tutorial', variant: 'destructive' });
    }
  };

  const selectedTutorial = tutorials.find(t => t.id === viewId);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Video Tutorials</h1>
        <Button
          onClick={() => {
            setCurrentTutorial({
              title: '',
              slug: '',
              description: '',
              videoUrl: '',
              videoType: 'youtube',
              category: '',
              tags: [],
              status: 'draft',
              metaDescription: '',
              readingLevel: 'easy',
              videoSource: 'upload',
              thumbnailUrl: '',
              captions: [],
              transcript: '',
              estimatedWatchTime: 0,
              prerequisites: [],
              visibility: 'public',
            });
            setEditId(null);
            setActiveTab('info');
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video Tutorial
        </Button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No video tutorials found.</div>
          ) : (
            tutorials.map(tutorial => (
              <div key={tutorial.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg line-clamp-2">{tutorial.title}</h2>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setViewId(tutorial.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      setCurrentTutorial(tutorial);
                      setEditId(tutorial.id);
                      setActiveTab('info');
                      setIsAddModalOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(tutorial.id)}
                      disabled={deletingId === tutorial.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize">{tutorial.category}</Badge>
                  {tutorial.tags && tutorial.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Status: <span className={tutorial.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{tutorial.status}</span>
                </div>
                <div className="mt-2">
                  {tutorial.videoType === 'youtube' && tutorial.videoUrl && (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://www.youtube.com/embed/${tutorial.videoUrl.split('v=')[1]}`}
                      title={tutorial.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  {tutorial.videoType === 'vimeo' && tutorial.videoUrl && (
                    <iframe
                      width="100%"
                      height="180"
                      src={`https://player.vimeo.com/video/${tutorial.videoUrl.split('/').pop()}`}
                      title={tutorial.title}
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                  {tutorial.videoType === 'upload' && tutorial.videoUrl && (
                    <video width="100%" height="180" controls src={tutorial.videoUrl} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">Step {activeTab === 'info' ? 1 : activeTab === 'assets' ? 2 : 3} of 3</span>
                <h2 className="text-xl font-semibold">
                  {editId ? 'Edit Video Tutorial' : 'Create New Video Tutorial'}
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>×</Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="w-full justify-start border-b px-6 bg-gray-50 sticky top-0 z-10">
                <TabsTrigger value="info">Video Info</TabsTrigger>
                <TabsTrigger value="assets">Assets & Captions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <div className="p-6 overflow-y-auto space-y-8 max-h-[60vh]">
                {/* Tab 1: Video Info */}
                <TabsContent value="info" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">Lesson Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={currentTutorial.title}
                      onChange={e => {
                        const title = e.target.value;
                        setCurrentTutorial({
                          ...currentTutorial,
                          title,
                          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        });
                      }}
                      placeholder="e.g. Recursion Deep Dive"
                      className={currentTutorial.title && currentTutorial.title.length < 5 ? 'border-red-500' : ''}
                    />
                    {currentTutorial.title && currentTutorial.title.length < 5 && (
                      <div className="text-xs text-red-500">Title must be at least 5 characters.</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="font-semibold">Slug / URL</Label>
                    <Input
                      id="slug"
                      value={currentTutorial.slug}
                      onChange={e => setCurrentTutorial({ ...currentTutorial, slug: e.target.value })}
                      placeholder="auto-generated from title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="introduction" className="font-semibold">Introduction / Summary</Label>
                    <MarkdownEditor
                      value={currentTutorial.introduction}
                      onChange={value => setCurrentTutorial({ ...currentTutorial, introduction: value })}
                      placeholder="1–2 sentence overview..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Module Association</Label>
                    <Select
                      value={currentTutorial.category}
                      onValueChange={value => {
                        if (value === '__add_new__') {
                          setAddingCategory(true);
                        } else {
                          setCurrentTutorial({ ...currentTutorial, category: value });
                          setAddingCategory(false);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                        <SelectItem value="__add_new__">+ Add new...</SelectItem>
                      </SelectContent>
                    </Select>
                    {addingCategory && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value)}
                          placeholder="Enter new module"
                          className="w-[200px]"
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            if (newCategory && !categories.includes(newCategory)) {
                              setCategories([...categories, newCategory]);
                              setCurrentTutorial({ ...currentTutorial, category: newCategory });
                              setNewCategory('');
                              setAddingCategory(false);
                            }
                          }}
                        >
                          Add
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingCategory(false)}>Cancel</Button>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedWatchTime" className="font-semibold">Estimated Watch Time (minutes)</Label>
                    <Input
                      id="estimatedWatchTime"
                      type="number"
                      value={currentTutorial.estimatedWatchTime}
                      onChange={e => setCurrentTutorial({ ...currentTutorial, estimatedWatchTime: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Tags / Keywords</Label>
                    <MultiSelect
                      value={currentTutorial.tags}
                      onChange={tags => setCurrentTutorial({ ...currentTutorial, tags })}
                      placeholder="e.g. recursion, divide-and-conquer"
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: Assets & Captions */}
                <TabsContent value="assets" className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Video Source</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={currentTutorial.videoSource === 'upload'}
                          onChange={() => setCurrentTutorial({ ...currentTutorial, videoSource: 'upload', videoUrl: '' })}
                        />
                        Upload File
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={currentTutorial.videoSource === 'embed'}
                          onChange={() => setCurrentTutorial({ ...currentTutorial, videoSource: 'embed', videoUrl: '' })}
                        />
                        Embed URL
                      </label>
                    </div>
                    {currentTutorial.videoSource === 'upload' && (
                      <FileUploader
                        accept="video/mp4,video/webm"
                        onUpload={async (files) => {
                          if (files[0].size > 500 * 1024 * 1024) {
                            toast({ title: 'File too large', description: 'Max 500MB allowed', variant: 'destructive' });
                            return;
                          }
                          const url = await uploadFileToStorage(files[0], 'video-tutorials/videos');
                          setCurrentTutorial({ ...currentTutorial, videoUrl: url });
                        }}
                        maxFiles={1}
                      />
                    )}
                    {currentTutorial.videoSource === 'embed' && (
                      <Input
                        value={currentTutorial.videoUrl}
                        onChange={e => setCurrentTutorial({ ...currentTutorial, videoUrl: e.target.value })}
                        placeholder="Paste YouTube/Vimeo embed link"
                      />
                    )}
                    {currentTutorial.videoUrl && currentTutorial.videoSource === 'upload' && (
                      <video width="100%" height="180" controls src={currentTutorial.videoUrl} className="mt-2" />
                    )}
                    {currentTutorial.videoUrl && currentTutorial.videoSource === 'embed' && (
                      <div className="mt-2">
                        <iframe
                          width="100%"
                          height="180"
                          src={currentTutorial.videoUrl}
                          title={currentTutorial.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Thumbnail Image</Label>
                    <FileUploader
                      accept="image/jpeg,image/png"
                      onUpload={async (files) => {
                        if (files[0].size > 5 * 1024 * 1024) {
                          toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
                          return;
                        }
                        const url = await uploadFileToStorage(files[0], 'video-tutorials/thumbnails');
                        setCurrentTutorial({ ...currentTutorial, thumbnailUrl: url });
                      }}
                      maxFiles={1}
                    />
                    {currentTutorial.thumbnailUrl && (
                      <img src={currentTutorial.thumbnailUrl} alt="Thumbnail" className="w-32 h-20 object-cover rounded mt-2" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Captions / Subtitles</Label>
                    <FileUploader
                      accept=".srt,.vtt"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'video-tutorials/captions');
                          return { url, name: file.name };
                        }));
                        setCurrentTutorial({
                          ...currentTutorial,
                          captions: [...(currentTutorial.captions || []), ...uploaded],
                        });
                      }}
                      maxFiles={10}
                    />
                    <ul className="mt-2 text-xs">
                      {(currentTutorial.captions || []).map((cap, i) => (
                        <li key={i}><a href={cap.url} target="_blank" rel="noopener noreferrer" className="underline">{cap.name}</a></li>
                      ))}
                    </ul>
                    {(!currentTutorial.captions || currentTutorial.captions.length === 0) && (
                      <div className="text-xs text-yellow-600">Warning: No captions uploaded. Required for accessibility.</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Transcript / Notes</Label>
                    <MarkdownEditor
                      value={currentTutorial.transcript}
                      onChange={value => setCurrentTutorial({ ...currentTutorial, transcript: value })}
                      placeholder="Paste transcript or notes here..."
                    />
                    <FileUploader
                      accept=".txt"
                      onUpload={async (files) => {
                        const file = files[0];
                        const text = await file.text();
                        setCurrentTutorial({ ...currentTutorial, transcript: text });
                      }}
                      maxFiles={1}
                    />
                  </div>
                </TabsContent>

                {/* Tab 3: Settings */}
                <TabsContent value="settings" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {currentTutorial.status === 'draft' ? 'Draft' : 'Live'}
                      </span>
                      <Switch
                        checked={currentTutorial.status === 'published'}
                        onCheckedChange={checked =>
                          setCurrentTutorial({
                            ...currentTutorial,
                            status: checked ? 'published' : 'draft',
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Go-Live Date</Label>
                    <DateTimePicker
                      value={currentTutorial.publishDate
                        ? (currentTutorial.publishDate.seconds
                            ? new Date(currentTutorial.publishDate.seconds * 1000)
                            : new Date(currentTutorial.publishDate)
                          )
                        : undefined
                      }
                      onChange={date => setCurrentTutorial({ ...currentTutorial, publishDate: date })}
                    />
                  </div>
                  <div>
                    <Label>Prerequisites</Label>
                    <MultiSelect
                      value={currentTutorial.prerequisites}
                      onChange={prerequisites => setCurrentTutorial({ ...currentTutorial, prerequisites })}
                      placeholder="Select prerequisite lessons..."
                    />
                  </div>
                  <div>
                    <Label>Visibility</Label>
                    <Select
                      value={currentTutorial.visibility}
                      onValueChange={value => setCurrentTutorial({ ...currentTutorial, visibility: value })}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="unlisted">Unlisted</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={currentTutorial.metaDescription}
                      onChange={e => setCurrentTutorial({ ...currentTutorial, metaDescription: e.target.value })}
                      placeholder="Enter meta description (max 160 characters)"
                      maxLength={160}
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {currentTutorial.metaDescription?.length || 0}/160 characters
                    </div>
                  </div>
                  <div>
                    <Label>Reading Level</Label>
                    <Select
                      value={currentTutorial.readingLevel}
                      onValueChange={value => setCurrentTutorial({ ...currentTutorial, readingLevel: value })}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select reading level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </div>
              <div className="p-6 border-t flex justify-end gap-4 bg-white sticky bottom-0 z-20">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={handleSave}>
                  Publish
                </Button>
              </div>
            </Tabs>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewId && selectedTutorial && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setViewId(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedTutorial.title}</h2>
            <div className="mb-2 text-sm text-gray-600">
              <span className="font-mono">Slug: {selectedTutorial.slug}</span>
            </div>
            <div className="mb-4 text-gray-700">
              <strong>Description:</strong>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{selectedTutorial.description}</ReactMarkdown>
              </div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="capitalize">{selectedTutorial.category}</Badge>
              {selectedTutorial.tags && selectedTutorial.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
              ))}
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Status: <span className={selectedTutorial.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{selectedTutorial.status}</span>
              {selectedTutorial.publishDate && (
                <span> | Published: {new Date(selectedTutorial.publishDate.seconds ? selectedTutorial.publishDate.seconds * 1000 : selectedTutorial.publishDate).toLocaleString()}</span>
              )}
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Reading Level: {selectedTutorial.readingLevel}
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Meta Description: {selectedTutorial.metaDescription}
            </div>
            <div className="mb-4">
              <strong>Video:</strong>
              <div className="mt-2">
                {selectedTutorial.videoType === 'youtube' && selectedTutorial.videoUrl && (
                  <iframe
                    width="100%"
                    height="320"
                    src={`https://www.youtube.com/embed/${selectedTutorial.videoUrl.split('v=')[1]}`}
                    title={selectedTutorial.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {selectedTutorial.videoType === 'vimeo' && selectedTutorial.videoUrl && (
                  <iframe
                    width="100%"
                    height="320"
                    src={`https://player.vimeo.com/video/${selectedTutorial.videoUrl.split('/').pop()}`}
                    title={selectedTutorial.title}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )}
                {selectedTutorial.videoType === 'upload' && selectedTutorial.videoUrl && (
                  <video width="100%" height="320" controls src={selectedTutorial.videoUrl} />
                )}
              </div>
            </div>
            <Button onClick={() => setViewId(null)} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 