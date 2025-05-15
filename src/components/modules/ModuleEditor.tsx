import { useState, useRef } from 'react';
import { X, Plus, GripVertical, Clock, Tag, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AddLessonModal } from '@/components/modules/AddLessonModal';
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'code' | 'text' | 'project';
  status: 'draft' | 'ready' | 'published';
  resourceRef: any;
}

interface Module {
  id: string;
  title: string;
  subtitle: string;
  track: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
  thumbnailUrl: string;
  status: 'draft' | 'live';
  goLiveDate: Date | null;
  lessons: Lesson[];
}

interface ModuleEditorProps {
  module?: Module;
  onClose: () => void;
  onSave?: () => void;
}

export function ModuleEditor({ module, onClose, onSave }: ModuleEditorProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState<Partial<Module>>({
    title: module?.title || '',
    subtitle: module?.subtitle || '',
    track: module?.track || '',
    difficulty: module?.difficulty || 'beginner',
    estimatedTime: module?.estimatedTime || 0,
    tags: module?.tags || [],
    thumbnailUrl: module?.thumbnailUrl || '',
    status: module?.status || 'draft',
    goLiveDate: module?.goLiveDate || null,
    lessons: module?.lessons || [],
  });

  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof Module, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSaveModule = async () => {
    if (module && module.id) {
      // Update existing module
      const moduleRef = doc(db, "modules", module.id);
      await updateDoc(moduleRef, deepRemoveUndefined(formData));
    } else {
      // Create new module
      await addDoc(collection(db, "modules"), deepRemoveUndefined(formData));
    }
    if (onSave) onSave();
    onClose();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error state
    setUploadError(null);

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `module-thumbnails/${fileName}`);
      // Upload file
      const uploadTask = await uploadBytes(storageRef, file);
      // Get download URL
      const url = await getDownloadURL(uploadTask.ref);
      // Update form data with new URL
      setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      // Clear any previous errors
      setUploadError(null);
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl rounded-l-2xl border-l border-gray-200">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {module ? 'Edit Module' : 'Create New Module'}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="px-8 pt-6 gap-4 bg-white sticky top-0 z-10">
            <TabsTrigger value="info">Module Info</TabsTrigger>
            <TabsTrigger value="metadata">Metadata & Tags</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          <div className="p-8 overflow-y-auto space-y-10">
            {/* Module Info Section */}
            <TabsContent value="info">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6 border">
                <h3 className="text-lg font-semibold mb-2">Module Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Module Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter module title"
                      className="mt-1 focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Subtitle / Short Description</Label>
                    <Textarea
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Enter short description (max 150 characters)"
                      className="mt-1 focus:ring-2 focus:ring-indigo-400"
                      maxLength={150}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">
                      {formData.subtitle?.length || 0}/150
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="track">Track</Label>
                    <Select
                      value={formData.track}
                      onValueChange={(value) => handleInputChange('track', value)}
                    >
                      <SelectTrigger className="mt-1 focus:ring-2 focus:ring-indigo-400">
                        <SelectValue placeholder="Select track" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="syntax-bootcamp" textValue="Syntax Bootcamp">
                          Syntax Bootcamp
                        </SelectItem>
                        <SelectItem value="dsa-roadmap">DSA Roadmap</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty Level</Label>
                    <RadioGroup
                      value={formData.difficulty}
                      onValueChange={(value) => handleInputChange('difficulty', value)}
                      className="mt-2 flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">Beginner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">Intermediate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">Advanced</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <Input
                        id="estimatedTime"
                        type="number"
                        value={formData.estimatedTime}
                        onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value))}
                        placeholder="Enter estimated time in minutes"
                        className="flex-1 focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Metadata & Tags Section */}
            <TabsContent value="metadata">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6 border">
                <h3 className="text-lg font-semibold mb-2">Metadata & Tags</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.tags?.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-indigo-100"
                          onClick={() => handleTagRemove(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            handleTagAdd(tagInput);
                            setTagInput('');
                          }
                        }}
                        className="focus:ring-2 focus:ring-indigo-400"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          handleTagAdd(tagInput);
                          setTagInput('');
                        }}
                        className="hover:bg-indigo-50"
                      >
                        Add Tag
                      </Button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Click a tag to remove it.</div>
                  </div>
                  <div>
                    <Label>Thumbnail Image</Label>
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center bg-white">
                      {formData.thumbnailUrl ? (
                        <div className="relative">
                          <img
                            src={formData.thumbnailUrl}
                            alt="Module thumbnail"
                            className="max-h-40 mx-auto rounded shadow"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 hover:bg-red-100"
                            onClick={() => handleInputChange('thumbnailUrl', null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="py-8">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={handleThumbnailUpload}
                            disabled={uploading}
                          />
                          <Button
                            variant="outline"
                            className="hover:bg-indigo-50"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {uploading ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                                Uploading...
                              </div>
                            ) : (
                              "Upload Image"
                            )}
                          </Button>
                          {uploadError && (
                            <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                          )}
                          <p className="mt-2 text-xs text-gray-500">
                            Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Publishing Section */}
            <TabsContent value="publishing">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6 border">
                <h3 className="text-lg font-semibold mb-2">Publishing Options</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status</Label>
                    <Switch
                      id="status"
                      checked={formData.status === 'live'}
                      onCheckedChange={(checked) =>
                        handleInputChange('status', checked ? 'live' : 'draft')
                      }
                    />
                  </div>
                  <div>
                    <Label>Go-Live Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full mt-2 justify-start text-left font-normal",
                            !formData.goLiveDate && "text-muted-foreground"
                          )}
                          disabled={formData.status === 'draft'}
                        >
                          {formData.goLiveDate && !isNaN(new Date(formData.goLiveDate).getTime()) ? (
                            format(new Date(formData.goLiveDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.goLiveDate || undefined}
                          onSelect={(date) => handleInputChange('goLiveDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Lessons Section */}
            <TabsContent value="lessons">
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Lessons</h3>
                  <Button size="sm" onClick={() => setAddLessonOpen(true)} className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </Button>
                </div>
                <AddLessonModal
                  open={addLessonOpen}
                  onClose={() => setAddLessonOpen(false)}
                  onSelect={(resource, type) => {
                    setFormData(prev => ({
                      ...prev,
                      lessons: [
                        ...(prev.lessons || []),
                        {
                          id: resource.id,
                          title: resource.title,
                          type,
                          status: 'draft',
                          resourceRef: resource,
                        }
                      ]
                    }));
                    setAddLessonOpen(false);
                  }}
                />
                {formData.lessons && formData.lessons.length > 0 ? (
                  <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-2">
                    {formData.lessons.map((lesson, idx) => (
                      <div key={lesson.id || idx} className="flex items-center gap-4 bg-white rounded shadow p-3 border hover:shadow-md transition-shadow">
                        <span className="text-xl">{getLessonTypeIcon(lesson.type)}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{lesson.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{lesson.type}</div>
                        </div>
                        <Badge className={getLessonStatusColor(lesson.status)}>
                          {lesson.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Remove Lesson"
                          className="text-red-500 hover:bg-red-100"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              lessons: prev.lessons?.filter((_, i) => i !== idx) || []
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mt-4">No lessons added yet.</div>
                )}
              </div>
            </TabsContent>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t bg-gradient-to-r from-white to-indigo-50 flex justify-end gap-4 rounded-b-2xl">
            <Button variant="outline" onClick={onClose} className="hover:bg-gray-100">
              Cancel
            </Button>
            <Button onClick={handleSaveModule} className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded shadow hover:bg-indigo-700">
              Save Module
            </Button>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function getLessonTypeIcon(type: string) {
  switch (type) {
    case 'video':
      return '🎥';
    case 'quiz':
      return '📝';
    case 'code':
      return '💻';
    case 'text':
      return '📄';
    case 'project':
      return '🎯';
    default:
      return '📄';
  }
}

function getLessonStatusColor(status: string) {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'ready':
      return 'bg-blue-100 text-blue-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function deepRemoveUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepRemoveUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, deepRemoveUndefined(v)])
    );
  }
  return obj;
} 