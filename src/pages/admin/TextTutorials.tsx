import React, { useEffect, useState } from 'react';
import { firestore, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Save, Clock, Image, FileText, Settings } from 'lucide-react';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactMarkdown from 'react-markdown';

interface Tutorial {
  id: string;
  title: string;
  slug: string;
  introduction: string;
  body: string;
  conclusion: string;
  estimatedReadTime: number;
  images: { url: string; alt: string }[];
  diagrams: { url: string; alt: string }[];
  videos: { url: string; platform: 'youtube' | 'vimeo' }[];
  downloadableAssets: { url: string; name: string; type: string }[];
  codeSnippets: { url: string; name: string }[];
  tags: string[];
  category: string;
  prerequisites: string[];
  status: 'draft' | 'published';
  publishDate?: Date;
  metaDescription: string;
  readingLevel: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export default function TextTutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [currentTutorial, setCurrentTutorial] = useState<Partial<Tutorial>>({
    title: '',
    slug: '',
    introduction: '',
    body: '',
    conclusion: '',
    estimatedReadTime: 0,
    images: [],
    diagrams: [],
    videos: [],
    downloadableAssets: [],
    codeSnippets: [],
    tags: [],
    category: '',
    prerequisites: [],
    status: 'draft',
    metaDescription: '',
    readingLevel: 'easy',
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const { toast } = useToast();

  // Add this state for categories
  const [categories, setCategories] = useState([
    'bootcamp',
    'dsa',
    'projects',
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (!isAddModalOpen || !currentTutorial.title) return;

    const autoSaveTimer = setInterval(async () => {
      try {
        setAutoSaveStatus('saving');
        // Implement auto-save logic here
        setAutoSaveStatus('saved');
      } catch (err) {
        setAutoSaveStatus('error');
      }
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveTimer);
  }, [isAddModalOpen, currentTutorial]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        if (validateForm()) {
          handlePublish();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentTutorial]);

  const validateForm = () => {
    if (currentTutorial.title?.length < 5) {
      toast({
        title: 'Validation Error',
        description: 'Title must be at least 5 characters long',
        variant: 'destructive',
      });
      return false;
    }

    if (currentTutorial.body?.split(/\s+/).length < 100) {
      toast({
        title: 'Warning',
        description: 'Body content seems too short. Consider adding more content.',
        variant: 'warning',
      });
    }

    if (currentTutorial.metaDescription?.length > 160) {
      toast({
        title: 'Validation Error',
        description: 'Meta description must be 160 characters or less',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      if (editId) {
        await updateDoc(doc(firestore, 'tutorials', editId), {
          ...currentTutorial,
          updatedAt: new Date(),
        });
        toast({
          title: 'Success',
          description: 'Tutorial updated successfully',
        });
      } else {
        await addDoc(collection(firestore, 'tutorials'), {
          ...currentTutorial,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        toast({
          title: 'Success',
          description: 'Tutorial created successfully',
        });
      }
      setIsAddModalOpen(false);
      setEditId(null);
      fetchTutorials();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to save tutorial',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    try {
      const tutorialData = {
        ...currentTutorial,
        status: 'published',
        publishDate: new Date(),
        updatedAt: new Date(),
      };

      if (editId) {
        await updateDoc(doc(firestore, 'tutorials', editId), tutorialData);
      } else {
        await addDoc(collection(firestore, 'tutorials'), tutorialData);
      }

      toast({
        title: 'Success',
        description: 'Tutorial published successfully',
      });
      setIsAddModalOpen(false);
      setEditId(null);
      fetchTutorials();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to publish tutorial',
        variant: 'destructive',
      });
    }
  };

  const fetchTutorials = async () => {
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(firestore, 'tutorials'));
      setTutorials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial)));
    } catch (err) {
      setError('Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(firestore, 'tutorials', id));
      await fetchTutorials();
      toast({
        title: 'Success',
        description: 'Tutorial deleted successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete tutorial',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const selectedTutorial = tutorials.find(t => t.id === viewId);

  // Helper for uploading a file to Firebase Storage
  async function uploadFileToStorage(file, folder = 'tutorials') {
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Text Tutorials</h1>
        <Button
          onClick={() => {
            setCurrentTutorial({
              title: '',
              slug: '',
              introduction: '',
              body: '',
              conclusion: '',
              estimatedReadTime: 0,
              images: [],
              diagrams: [],
              videos: [],
              downloadableAssets: [],
              codeSnippets: [],
              tags: [],
              category: '',
              prerequisites: [],
              status: 'draft',
              metaDescription: '',
              readingLevel: 'easy',
            });
            setEditId(null);
            setActiveTab('content');
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tutorial
        </Button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No tutorials found.</div>
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
                      setActiveTab('content');
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
                  <Badge variant="secondary" className="capitalize">{tutorial.difficulty}</Badge>
                  <Badge variant="secondary" className="capitalize">{tutorial.category}</Badge>
                  {tutorial.tags && tutorial.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Status: <span className={tutorial.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                    {tutorial.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {editId ? 'Edit Tutorial' : 'Create New Tutorial'}
                </h2>
                <div className="text-sm text-gray-500">
                  {autoSaveStatus === 'saving' && 'Saving...'}
                  {autoSaveStatus === 'saved' && 'All changes saved'}
                  {autoSaveStatus === 'error' && 'Error saving changes'}
                </div>
              </div>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>×</Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="w-full justify-start border-b px-6 bg-gray-50 sticky top-0 z-10">
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Media & Resources
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings & SEO
                </TabsTrigger>
              </TabsList>

              <div className="p-6 overflow-y-auto space-y-8 max-h-[60vh]">
                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">Lesson Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={currentTutorial.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setCurrentTutorial({
                          ...currentTutorial,
                          title,
                          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        });
                      }}
                      placeholder="e.g. Understanding Recursion"
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
                      onChange={(e) => setCurrentTutorial({ ...currentTutorial, slug: e.target.value })}
                      placeholder="auto-generated from title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="introduction" className="font-semibold">Introduction</Label>
                    <div className="text-xs text-muted-foreground mb-1">Short lead-in paragraph for the lesson.</div>
                    <MarkdownEditor
                      value={currentTutorial.introduction}
                      onChange={(value) => setCurrentTutorial({ ...currentTutorial, introduction: value })}
                      placeholder="Enter a short lead-in paragraph..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body" className="font-semibold">Body <span className="text-red-500">*</span></Label>
                    <div className="text-xs text-muted-foreground mb-1">Main content. Supports Markdown, code blocks, and LaTeX.</div>
                    <MarkdownEditor
                      value={currentTutorial.body}
                      onChange={(value) => setCurrentTutorial({ ...currentTutorial, body: value })}
                      placeholder="Enter the main content..."
                    />
                    {currentTutorial.body && currentTutorial.body.split(/\s+/).length < 100 && (
                      <div className="text-xs text-yellow-600">Body should be at least 100 words for best results.</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conclusion" className="font-semibold">Conclusion / Summary</Label>
                    <div className="text-xs text-muted-foreground mb-1">Key takeaways or next steps.</div>
                    <MarkdownEditor
                      value={currentTutorial.conclusion}
                      onChange={(value) => setCurrentTutorial({ ...currentTutorial, conclusion: value })}
                      placeholder="Enter key takeaways and next steps..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedReadTime" className="font-semibold">Estimated Read Time (minutes)</Label>
                    <Input
                      id="estimatedReadTime"
                      type="number"
                      value={currentTutorial.estimatedReadTime}
                      onChange={(e) => setCurrentTutorial({ ...currentTutorial, estimatedReadTime: parseInt(e.target.value) })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                  <div>
                    <Label>Inline Images</Label>
                    <FileUploader
                      accept="image/*"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'tutorials/images');
                          return { url, alt: file.name };
                        }));
                        setCurrentTutorial({
                          ...currentTutorial,
                          images: [...(currentTutorial.images || []), ...uploaded],
                        });
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(currentTutorial.images || []).map((img, i) => (
                        <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Diagrams/Illustrations</Label>
                    <FileUploader
                      accept=".svg,.png"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'tutorials/diagrams');
                          return { url, alt: file.name };
                        }));
                        setCurrentTutorial({
                          ...currentTutorial,
                          diagrams: [...(currentTutorial.diagrams || []), ...uploaded],
                        });
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(currentTutorial.diagrams || []).map((img, i) => (
                        <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Downloadable Assets</Label>
                    <FileUploader
                      accept=".pdf,.pptx,.zip"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'tutorials/assets');
                          return { url, name: file.name, type: file.type };
                        }));
                        setCurrentTutorial({
                          ...currentTutorial,
                          downloadableAssets: [...(currentTutorial.downloadableAssets || []), ...uploaded],
                        });
                      }}
                    />
                    <ul className="mt-2 text-xs">
                      {(currentTutorial.downloadableAssets || []).map((asset, i) => (
                        <li key={i}><a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline">{asset.name}</a></li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <Label>Code Snippet Files</Label>
                    <FileUploader
                      accept=".txt,.md"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'tutorials/code-snippets');
                          return { url, name: file.name };
                        }));
                        setCurrentTutorial({
                          ...currentTutorial,
                          codeSnippets: [...(currentTutorial.codeSnippets || []), ...uploaded],
                        });
                      }}
                    />
                    <ul className="mt-2 text-xs">
                      {(currentTutorial.codeSnippets || []).map((snip, i) => (
                        <li key={i}><a href={snip.url} target="_blank" rel="noopener noreferrer" className="underline">{snip.name}</a></li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <div>
                    <Label>Tags / Keywords</Label>
                    <MultiSelect
                      value={currentTutorial.tags}
                      onChange={(tags) => setCurrentTutorial({ ...currentTutorial, tags })}
                      placeholder="Select or type tags..."
                    />
                  </div>

                  <div>
                    <Label>Category / Module</Label>
                    <Select
                      value={currentTutorial.category}
                      onValueChange={(value) => {
                        if (value === '__add_new__') {
                          setAddingCategory(true);
                        } else {
                          setCurrentTutorial({ ...currentTutorial, category: value });
                          setAddingCategory(false);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
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
                          placeholder="Enter new category"
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

                  <div>
                    <Label>Prerequisites</Label>
                    <MultiSelect
                      value={currentTutorial.prerequisites}
                      onChange={(prerequisites) => setCurrentTutorial({ ...currentTutorial, prerequisites })}
                      placeholder="Select prerequisite lessons..."
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {currentTutorial.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                      <Switch
                        checked={currentTutorial.status === 'published'}
                        onCheckedChange={(checked) =>
                          setCurrentTutorial({
                            ...currentTutorial,
                            status: checked ? 'published' : 'draft',
                          })
                        }
                      />
                    </div>
                  </div>

                  {currentTutorial.status === 'published' && (
                    <div>
                      <Label>Publish Date</Label>
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
                  )}

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={currentTutorial.metaDescription}
                      onChange={(e) => setCurrentTutorial({ ...currentTutorial, metaDescription: e.target.value })}
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
                      onValueChange={(value) => setCurrentTutorial({ ...currentTutorial, readingLevel: value as Tutorial['readingLevel'] })}
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
                <Button onClick={handlePublish}>
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
              <strong>Introduction:</strong>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{selectedTutorial.introduction}</ReactMarkdown>
              </div>
            </div>
            <div className="mb-4 text-gray-700">
              <strong>Body:</strong>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{selectedTutorial.body}</ReactMarkdown>
              </div>
            </div>
            <div className="mb-4 text-gray-700">
              <strong>Conclusion:</strong>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{selectedTutorial.conclusion}</ReactMarkdown>
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
              Estimated Read Time: {selectedTutorial.estimatedReadTime} min
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Meta Description: {selectedTutorial.metaDescription}
            </div>
            <div className="mb-2 text-xs text-gray-500">
              Prerequisites: {(selectedTutorial.prerequisites || []).join(', ')}
            </div>
            <div className="mb-4">
              <strong>Images:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {(selectedTutorial.images || []).map((img, i) => (
                  <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <strong>Diagrams:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {(selectedTutorial.diagrams || []).map((img, i) => (
                  <img key={i} src={img.url} alt={img.alt} className="w-16 h-16 object-cover rounded" />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <strong>Downloadable Assets:</strong>
              <ul className="mt-1 text-xs">
                {(selectedTutorial.downloadableAssets || []).map((asset, i) => (
                  <li key={i}><a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline">{asset.name}</a></li>
                ))}
              </ul>
            </div>
            <div className="mb-4">
              <strong>Code Snippets:</strong>
              <ul className="mt-1 text-xs">
                {(selectedTutorial.codeSnippets || []).map((snip, i) => (
                  <li key={i}><a href={snip.url} target="_blank" rel="noopener noreferrer" className="underline">{snip.name}</a></li>
                ))}
              </ul>
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