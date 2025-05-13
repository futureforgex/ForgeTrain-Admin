import React, { useState, useEffect, useCallback } from 'react';
import { X, Info, Clock, Lock, CheckCircle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { firestore, storage } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUploader } from '@/components/ui/file-uploader';
import { GripVertical, MoreVertical, Edit, Trash2, Eye, Copy, Plus } from 'lucide-react';
import { LessonPanel } from './LessonPanel';

interface ModuleFormProps {
  onClose: () => void;
}

interface FormData {
  title: string;
  subtitle: string;
  track: 'syntax' | 'dsa' | 'projects';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  tags: string[];
  thumbnail: File | null;
  status: 'draft' | 'live';
  goLiveDate: string | null;
  lessons: string[];
  prerequisites: string[];
  visibility: 'public' | 'unlisted' | 'private';
  completionCriteria: {
    allLessonsComplete: boolean;
    passQuiz: boolean;
    projectComplete: boolean;
  };
}

const initialFormData: FormData = {
  title: '',
  subtitle: '',
  track: 'syntax',
  difficulty: 'beginner',
  estimatedTime: 0,
  tags: [],
  thumbnail: null,
  status: 'draft',
  goLiveDate: null,
  lessons: [],
  prerequisites: [],
  visibility: 'public',
  completionCriteria: {
    allLessonsComplete: true,
    passQuiz: false,
    projectComplete: false,
  },
};

const lessonTypes = [
  { value: 'video', label: 'Video Tutorial', icon: '🎥' },
  { value: 'code', label: 'Code Challenge', icon: '⚙️' },
  { value: 'quiz', label: 'Quiz', icon: '❓' },
  { value: 'article', label: 'Article/Text Tutorial', icon: '📄' },
  { value: 'project', label: 'Project Task', icon: '🚀' },
];

export function ModuleForm({ onClose }: ModuleFormProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // Add state for tracks and new track input
  const [tracks, setTracks] = useState([
    { value: 'syntax', label: 'Syntax Bootcamp' },
    { value: 'dsa', label: 'DSA Roadmap' },
    { value: 'projects', label: 'Projects' },
  ]);
  const [showNewTrackInput, setShowNewTrackInput] = useState(false);
  const [newTrackName, setNewTrackName] = useState('');

  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [lessons, setLessons] = useState([]); // Array of lesson objects
  const [showLessonPanel, setShowLessonPanel] = useState(false);
  const [lessonTypeToAdd, setLessonTypeToAdd] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const validateForm = useCallback((data: FormData) => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (data.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }
    if (data.subtitle.length > 150) {
      newErrors.subtitle = 'Subtitle must be 150 characters or less';
    }
    if (data.thumbnail && data.thumbnail.size > 2 * 1024 * 1024) {
      newErrors.thumbnail = 'Thumbnail must be less than 2MB';
    }
    return newErrors;
  }, []);

  // Update errors whenever formData changes
  useEffect(() => {
    setErrors(validateForm(formData));
  }, [formData, validateForm]);

  // Update thumbnail preview when a new file is selected
  useEffect(() => {
    if (formData.thumbnail) {
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(formData.thumbnail);
    } else {
      setThumbnailPreview(null);
    }
  }, [formData.thumbnail]);

  const handleSubmit = useCallback(async (publish: boolean) => {
    const currentErrors = validateForm(formData);
    if (Object.keys(currentErrors).length > 0) return;
    setLoading(true);
    let thumbnailUrl = '';
    try {
      // Upload thumbnail if present
      if (formData.thumbnail) {
        const storageRef = ref(storage, `module-thumbnails/${Date.now()}-${formData.thumbnail.name}`);
        await uploadBytes(storageRef, formData.thumbnail);
        thumbnailUrl = await getDownloadURL(storageRef);
      }
      // Store module in Firestore
      await addDoc(collection(firestore, 'modules'), {
        ...formData,
        thumbnail: thumbnailUrl,
        createdAt: Timestamp.now(),
        status: publish ? 'live' : 'draft',
      });
      toast({
        title: publish ? 'Module published!' : 'Draft saved',
        description: publish
          ? 'Your module is now live and visible to students.'
          : 'Your changes have been saved as a draft.',
      });
      onClose();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save module', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, toast, onClose]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      // Here you would typically save to backend
      console.log('Auto-saving draft...', formData);
      setIsDirty(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, [formData, isDirty]);

  const handleFormChange = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  }, []);

  // Add/Edit lesson handlers
  const handleAddLesson = (type) => {
    setLessonTypeToAdd(type);
    setEditingLesson(null);
    setShowLessonPanel(true);
  };
  const handleEditLesson = (lesson, idx) => {
    setLessonTypeToAdd(lesson.type);
    setEditingLesson({ ...lesson, idx });
    setShowLessonPanel(true);
  };
  const handleSaveLesson = (lesson) => {
    if (editingLesson) {
      setLessons(lessons.map((l, i) => (i === editingLesson.idx ? lesson : l)));
    } else {
      setLessons([...lessons, lesson]);
    }
    setShowLessonPanel(false);
    setEditingLesson(null);
    setLessonTypeToAdd(null);
  };
  // Drag and drop reordering (placeholder, implement with a library for production)
  const handleMoveLesson = (fromIdx, toIdx) => {
    const updated = [...lessons];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setLessons(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Create New Module</h2>
            <p className="text-sm text-muted-foreground">Step 1 of 1</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Content */}
        <ScrollArea className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto mt-8 bg-white rounded shadow p-6">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Module Info</TabsTrigger>
              <TabsTrigger value="lessons">Lessons & Sequence</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* 1. Module Info Tab */}
            <TabsContent value="info">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="flex items-center gap-2">
                    Module Title
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleFormChange({ title: e.target.value })}
                    className={cn(errors.title && 'border-red-500')}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle / Short Description</Label>
                  <Textarea
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => handleFormChange({ subtitle: e.target.value })}
                    maxLength={150}
                    className={cn(errors.subtitle && 'border-red-500')}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {formData.subtitle.length}/150 characters
                  </p>
                </div>

                <div>
                  <Label>Thumbnail Image</Label>
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFormChange({ thumbnail: file });
                        }
                      }}
                      className={cn('w-full sm:w-auto', errors.thumbnail && 'border-red-500')}
                      disabled={loading}
                    />
                    {thumbnailPreview && (
                      <img src={thumbnailPreview} alt="Thumbnail preview" className="w-32 h-20 object-cover rounded border" />
                    )}
                    {errors.thumbnail && (
                      <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="track">Track</Label>
                  <Select
                    value={formData.track}
                    onValueChange={(value: string) => {
                      if (value === '__new__') {
                        setShowNewTrackInput(true);
                      } else {
                        setShowNewTrackInput(false);
                        handleFormChange({ track: value as any });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tracks.map((track) => (
                        <SelectItem key={track.value} value={track.value}>{track.label}</SelectItem>
                      ))}
                      <SelectItem value="__new__" className="text-blue-600">+ Create new track...</SelectItem>
                    </SelectContent>
                  </Select>
                  {showNewTrackInput && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="New track name"
                        value={newTrackName}
                        onChange={e => setNewTrackName(e.target.value)}
                        className="w-48"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (!newTrackName.trim()) return;
                          const newValue = newTrackName.trim().toLowerCase().replace(/\s+/g, '-');
                          setTracks([...tracks, { value: newValue, label: newTrackName.trim() }]);
                          handleFormChange({ track: newValue as any });
                          setShowNewTrackInput(false);
                          setNewTrackName('');
                        }}
                      >
                        Add
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => { setShowNewTrackInput(false); setNewTrackName(''); }}>Cancel</Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Difficulty Level</Label>
                  <RadioGroup
                    value={formData.difficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      handleFormChange({ difficulty: value })}
                    className="flex gap-4 mt-2"
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
                  <Label htmlFor="estimatedTime" className="flex items-center gap-2">
                    Estimated Time
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="estimatedTime"
                      type="number"
                      value={formData.estimatedTime}
                      onChange={(e) => handleFormChange({ 
                        estimatedTime: parseInt(e.target.value) || 0 
                      })}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 2. Lessons & Sequence Tab */}
            <TabsContent value="lessons">
              <div className="flex gap-2 mb-4">
                <Select onValueChange={handleAddLesson} value="">
                  <SelectTrigger><SelectValue placeholder="+ Add Lesson" /></SelectTrigger>
                  <SelectContent>
                    {lessonTypes.map(lt => (
                      <SelectItem key={lt.value} value={lt.value}>{lt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">Bulk Actions</Button>
                <Button variant="outline">Filter by Type</Button>
              </div>
              {/* Slide-over for adding/editing lessons */}
              {showLessonPanel && (
                <LessonPanel
                  type={lessonTypeToAdd}
                  initialData={editingLesson}
                  onClose={() => { setShowLessonPanel(false); setEditingLesson(null); setLessonTypeToAdd(null); }}
                  onSave={handleSaveLesson}
                />
              )}
              {/* Draggable Lesson List */}
              <div className="mt-6">
                {lessons.length === 0 && <div className="text-gray-400 text-center">No lessons added yet.</div>}
                {lessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-2 border-b py-2">
                    <span className="cursor-move text-xl">{lessonTypes.find(lt => lt.value === lesson.type)?.icon}</span>
                    <span className="font-medium flex-1">{lesson.title}</span>
                    <span className="w-24 text-sm text-gray-500">{lesson.estimatedTime} mins</span>
                    <span className="w-16 text-xs capitalize">{lesson.status}</span>
                    <Button size="icon" variant="ghost" onClick={() => handleEditLesson(lesson, idx)}><Edit className="w-4 h-4" /></Button>
                    <Button size="icon" variant="ghost"><MoreVertical className="w-4 h-4" /></Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* 3. Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-4">
                <div>
                  <Label>Status</Label>
                  <RadioGroup
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'live') => handleFormChange({ status: value })}
                    className="flex gap-4"
                  >
                    <div><RadioGroupItem value="draft" id="draft" /> <label htmlFor="draft">Draft</label></div>
                    <div><RadioGroupItem value="live" id="live" /> <label htmlFor="live">Live</label></div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Go-Live Date</Label>
                  <Input
                    type="datetime-local"
                    disabled={formData.status === 'draft'}
                    value={formData.goLiveDate || ''}
                    onChange={(e) => handleFormChange({ goLiveDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Prerequisites</Label>
                  <MultiSelect value={formData.prerequisites} onChange={(value) => handleFormChange({ prerequisites: value })} placeholder="Select prerequisite modules..." />
                </div>

                <div>
                  <Label>Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onValueChange={(value: 'public' | 'unlisted' | 'private') => 
                      handleFormChange({ visibility: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="unlisted">Unlisted</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t">
          <div className="flex items-center gap-2">
            {isDirty && (
              <span className="text-sm text-muted-foreground">Draft saved</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSubmit(false)}
              disabled={Object.keys(errors).length > 0 || loading}
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={() => handleSubmit(true)}
              disabled={Object.keys(errors).length > 0 || loading}
            >
              {loading ? 'Publishing...' : 'Publish Module'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 