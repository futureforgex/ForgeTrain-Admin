import React, { useState } from 'react';
import { X, Info, Video, Code, FileText, ListChecks, FilePlus, ChevronDown, ChevronUp, Plus, Trash2, GripVertical, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/multi-select';
import { FileUploader } from '@/components/ui/file-uploader';

interface LessonPanelProps {
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  type: string;
}

const lessonTypes = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'code', label: 'Code Challenge', icon: Code },
  { value: 'quiz', label: 'Quiz', icon: ListChecks },
  { value: 'article', label: 'Article/Text Tutorial', icon: FileText },
  { value: 'project', label: 'Project Task', icon: FilePlus },
];

// Add helper for file validation and preview
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

function getAllowedFileTypes(type: string) {
  switch (type) {
    case 'video':
      return [
        { label: 'Video', accept: '.mp4,.webm', maxSize: MAX_VIDEO_SIZE },
        { label: 'Thumbnail', accept: '.jpg,.jpeg,.png', maxSize: MAX_IMAGE_SIZE },
        { label: 'Captions', accept: '.vtt,.srt', maxSize: 2 * 1024 * 1024 },
        { label: 'Transcript/Notes', accept: '.txt,.md', maxSize: 2 * 1024 * 1024 },
        { label: 'Preview GIF/Poster', accept: '.gif,.jpg,.jpeg,.png', maxSize: MAX_IMAGE_SIZE },
      ];
    case 'code':
      return [
        { label: 'Starter Code', accept: '.py,.js,.java,.cpp', maxSize: 1 * 1024 * 1024 },
        { label: 'Test Cases', accept: '.json,.yaml,.yml', maxSize: 1 * 1024 * 1024 },
        { label: 'Supporting Libraries', accept: '.zip,.js,.py', maxSize: 10 * 1024 * 1024 },
        { label: 'Hints', accept: '.txt,.md', maxSize: 1 * 1024 * 1024 },
      ];
    case 'quiz':
      return [
        { label: 'Question Bank', accept: '.json', maxSize: 1 * 1024 * 1024 },
        { label: 'Images/Diagrams', accept: '.jpg,.jpeg,.png,.svg', maxSize: MAX_IMAGE_SIZE },
        { label: 'Audio Clips', accept: '.mp3,.wav', maxSize: 10 * 1024 * 1024 },
      ];
    case 'article':
      return [
        { label: 'Inline Images', accept: '.jpg,.jpeg,.png,.svg', maxSize: MAX_IMAGE_SIZE },
        { label: 'Embedded Media', accept: '.pdf,.pptx', maxSize: MAX_PDF_SIZE },
      ];
    case 'project':
      return [
        { label: 'Project Template', accept: '.zip', maxSize: 50 * 1024 * 1024 },
        { label: 'Spec Document', accept: '.pdf,.md,.docx', maxSize: MAX_PDF_SIZE },
        { label: 'Assets/Data', accept: '.csv,.json,.jpg,.png', maxSize: 10 * 1024 * 1024 },
        { label: 'Docker/Env', accept: '.txt,.json', maxSize: 1 * 1024 * 1024 },
        { label: 'Submission Scripts', accept: '.sh,.makefile', maxSize: 1 * 1024 * 1024 },
      ];
    default:
      return [];
  }
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function LessonPanel({ onClose, onSave, initialData, type }: LessonPanelProps) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    subtitle: initialData?.subtitle || '',
    order: initialData?.order || 1,
    estimatedTime: initialData?.estimatedTime || 0,
    type: initialData?.type || 'article',
    content: initialData?.content || '',
    videoUrl: initialData?.videoUrl || '',
    attachments: initialData?.attachments || [],
    prerequisites: initialData?.prerequisites || [],
    tags: initialData?.tags || [],
    metaDescription: initialData?.metaDescription || '',
    status: initialData?.status || 'draft',
    goLiveDate: initialData?.goLiveDate || '',
    quiz: initialData?.quiz || [],
    codeChallenge: initialData?.codeChallenge || {},
    projectTask: initialData?.projectTask || {},
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [assetFiles, setAssetFiles] = useState<any>({});
  const [assetMeta, setAssetMeta] = useState<any>({});
  const [assetErrors, setAssetErrors] = useState<any>({});
  const [showCodeChallenge, setShowCodeChallenge] = useState(true);
  // For code challenge fields
  const [ccDifficulty, setCcDifficulty] = useState(form.codeChallenge?.difficulty || 'Easy');
  const [ccStarterCode, setCcStarterCode] = useState(form.codeChallenge?.starterCode || { python: '', javascript: '' });
  const [ccTestCases, setCcTestCases] = useState(form.codeChallenge?.testCases || [
    { input: '', expected: '', isSample: true, weight: 1 },
  ]);
  const [ccHints, setCcHints] = useState(form.codeChallenge?.hints || [{ order: 1, text: '' }]);
  const [ccEditorialSteps, setCcEditorialSteps] = useState(form.codeChallenge?.editorialSteps || [{ order: 1, title: '', content: '', codeSample: { python: '' } }]);
  const [existingContent, setExistingContent] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);

  // Real-time validation (example for required fields)
  const validate = () => {
    const errs: any = {};
    if (!form.title || form.title.length < 5) errs.title = 'Title is required (min 5 chars)';
    if (!form.type) errs.type = 'Lesson type is required';
    if (form.type === 'video' && !form.videoUrl) errs.videoUrl = 'Video URL is required';
    if (form.type === 'article' && !form.content) errs.content = 'Content is required';
    // Add more validation as needed
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form changes
  const handleChange = async (field: string, value: any) => {
    if (field === 'type') {
      setLoadingContent(true);
      const content = await fetchExistingContent(value);
      setExistingContent(content);
      setLoadingContent(false);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  function handleAssetChange(key: string, file: File | null) {
    if (!file) return;
    // Validate type and size
    const allowed = getAllowedFileTypes(form.type).find(f => f.label === key);
    if (allowed) {
      if (!allowed.accept.split(',').some(ext => file.name.toLowerCase().endsWith(ext.replace('.', '')))) {
        setAssetErrors((prev: any) => ({ ...prev, [key]: 'Invalid file type' }));
        return;
      }
      if (file.size > allowed.maxSize) {
        setAssetErrors((prev: any) => ({ ...prev, [key]: `File too large (max ${Math.round(allowed.maxSize/1024/1024)}MB)` }));
        return;
      }
    }
    setAssetFiles((prev: any) => ({ ...prev, [key]: file }));
    setAssetMeta((prev: any) => ({ ...prev, [key]: { name: file.name, size: file.size, type: file.type } }));
    setAssetErrors((prev: any) => ({ ...prev, [key]: undefined }));
  }

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (form.type === 'code') {
        form.codeChallenge = {
          difficulty: ccDifficulty,
          starterCode: ccStarterCode,
          testCases: ccTestCases,
          hints: ccHints,
          editorialSteps: ccEditorialSteps,
        };
      }
      // Choose the correct collection based on lesson type
      let collectionName = 'lessons';
      switch (form.type) {
        case 'code':
          collectionName = 'challenges';
          break;
        case 'project':
          collectionName = 'projectTasks';
          break;
        case 'video':
          collectionName = 'videoTutorials';
          break;
        case 'article':
          collectionName = 'tutorials';
          break;
        case 'quiz':
          collectionName = 'quizzes';
          break;
      }
      // Save to Firestore
      await addDoc(collection(db, collectionName), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      onSave(form); // Optionally update local state/UI
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setErrors({ save: 'Failed to save lesson.' });
    }
  };

  const fetchExistingContent = async (type: string) => {
    try {
      let collectionName = '';
      switch (type) {
        case 'video':
          collectionName = 'videoTutorials';
          break;
        case 'article':
          collectionName = 'tutorials';
          break;
        case 'code':
          collectionName = 'challenges';
          break;
        case 'quiz':
          collectionName = 'quizzes';
          break;
        case 'project':
          collectionName = 'projectTasks';
          break;
        default:
          return [];
      }

      const q = query(collection(db, collectionName));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        // For code challenges, map fields as needed
        if (type === 'code') {
          return {
            id: doc.id,
            ...data,
            title: data.slug || doc.id,
            description: data.description || '',
            difficulty: data.difficulty || 'Easy',
            starterCode: data.starterCode || { python: '' },
            testCases: data.testCases || [],
            hints: data.hints || [],
            editorialSteps: data.editorialSteps || [],
          };
        }
        return { id: doc.id, ...data };
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      return [];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Create New Lesson</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Form Content */}
        <ScrollArea className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <div className="space-y-8">
            {/* Lesson Metadata */}
            <section>
              <h3 className="text-lg font-medium mb-4">Lesson Metadata</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-title">Lesson Title</Label>
                  <Input
                    id="lesson-title"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    className={errors.title && 'border-red-500'}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <Label htmlFor="lesson-subtitle">Subtitle / Objective</Label>
                  <Textarea
                    id="lesson-subtitle"
                    value={form.subtitle}
                    onChange={e => handleChange('subtitle', e.target.value)}
                    maxLength={200}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="lesson-order">Order</Label>
                    <Input
                      id="lesson-order"
                      type="number"
                      value={form.order}
                      onChange={e => handleChange('order', Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="lesson-time">Estimated Time (mins)</Label>
                    <Input
                      id="lesson-time"
                      type="number"
                      value={form.estimatedTime}
                      onChange={e => handleChange('estimatedTime', Number(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </section>
            {/* Lesson Type */}
            <section>
              <h3 className="text-lg font-medium mb-4">Lesson Type</h3>
              <RadioGroup
                value={form.type}
                onValueChange={val => handleChange('type', val)}
                className="flex flex-wrap gap-4"
              >
                {lessonTypes.map(({ value, label, icon: Icon }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <RadioGroupItem value={value} id={value} />
                    <Label htmlFor={value} className="flex items-center gap-1">
                      <Icon className="h-4 w-4" /> {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
            </section>
            {/* Add this after the Lesson Type section */}
            {form.type && (
              <section>
                <h3 className="text-lg font-medium mb-4">Existing Content</h3>
                {loadingContent ? (
                  <div className="text-center py-4">Loading content...</div>
                ) : existingContent.length > 0 ? (
                  <div className="space-y-2">
                    {existingContent.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // Pre-fill form with selected content
                          setForm(prev => ({
                            ...prev,
                            title: item.title || '',
                            subtitle: item.description || '',
                            content: item.content || '',
                            videoUrl: item.videoUrl || '',
                            quiz: item.questions || item.quiz || [],
                            codeChallenge: {
                              difficulty: item.difficulty || 'Easy',
                              starterCode: item.starterCode || { python: '', javascript: '' },
                              testCases: item.testCases || [{ input: '', expected: '', isSample: true, weight: 1 }],
                              hints: item.hints || [{ order: 1, text: '' }],
                              editorialSteps: item.editorialSteps || [{ order: 1, title: '', content: '', codeSample: { python: '' } }]
                            },
                            projectTask: {
                              description: item.description || '',
                              requirements: item.requirements || [],
                              deliverables: item.deliverables || [],
                              resources: item.resources || [],
                              evaluation: item.evaluation || {},
                              timeline: item.timeline || {},
                              ...item.projectTask
                            },
                            tags: item.tags || [],
                            metaDescription: item.metaDescription || '',
                          }));

                          // Update code challenge specific states
                          if (form.type === 'code') {
                            setCcDifficulty(item.difficulty || 'Easy');
                            setCcStarterCode(item.starterCode || { python: '', javascript: '' });
                            setCcTestCases(item.testCases || [{ input: '', expected: '', isSample: true, weight: 1 }]);
                            setCcHints(item.hints || [{ order: 1, text: '' }]);
                            setCcEditorialSteps(item.editorialSteps || [{ order: 1, title: '', content: '', codeSample: { python: '' } }]);
                          }
                        }}
                      >
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-500">{item.description}</p>
                          {form.type === 'code' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Difficulty: {item.difficulty || 'Not set'} | 
                              Test Cases: {item.testCases?.length || 0} | 
                              Hints: {item.hints?.length || 0}
                            </div>
                          )}
                          {form.type === 'project' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Requirements: {item.requirements?.length || 0} | 
                              Deliverables: {item.deliverables?.length || 0}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm">
                          Use This
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No existing content found for this type
                  </div>
                )}
              </section>
            )}
            {/* Content Editor (dynamic) */}
            <section>
              <h3 className="text-lg font-medium mb-4">Content</h3>
              {form.type === 'article' && (
                <Textarea
                  value={form.content}
                  onChange={e => handleChange('content', e.target.value)}
                  placeholder="Write lesson content here (Markdown supported)"
                  rows={8}
                  className={errors.content && 'border-red-500'}
                />
              )}
              {form.type === 'video' && (
                <Input
                  value={form.videoUrl}
                  onChange={e => handleChange('videoUrl', e.target.value)}
                  placeholder="Video URL or upload..."
                  className={errors.videoUrl && 'border-red-500'}
                />
              )}
              {form.type === 'quiz' && (
                <Textarea
                  value={form.quiz ? JSON.stringify(form.quiz, null, 2) : ''}
                  onChange={e => {
                    try {
                      handleChange('quiz', JSON.parse(e.target.value || '[]'));
                    } catch {
                      handleChange('quiz', []);
                    }
                  }}
                  placeholder="Paste quiz JSON here or edit existing quiz content"
                  rows={8}
                  className={errors.quiz && 'border-red-500'}
                />
              )}
              {form.type === 'project' && (
                <Textarea
                  value={form.projectTask ? JSON.stringify(form.projectTask, null, 2) : ''}
                  onChange={e => {
                    try {
                      handleChange('projectTask', JSON.parse(e.target.value || '{}'));
                    } catch {
                      handleChange('projectTask', {});
                    }
                  }}
                  placeholder="Paste project task JSON here or edit existing project content"
                  rows={8}
                  className={errors.projectTask && 'border-red-500'}
                />
              )}
            </section>
            {/* Attachments & Assets */}
            <section>
              <h3 className="text-lg font-medium mb-4">Attachments & Assets</h3>
              {getAllowedFileTypes(form.type).map(({ label, accept, maxSize }) => (
                <div key={label} className="mb-2">
                  <Label>{label}</Label>
                  <Input
                    type="file"
                    accept={accept}
                    onChange={e => handleAssetChange(label, e.target.files?.[0] || null)}
                  />
                  {assetFiles[label] && (
                    <div className="text-xs text-gray-600 mt-1">
                      {assetFiles[label].name} ({Math.round(assetFiles[label].size/1024)} KB)
                      {/* Preview for images/videos */}
                      {assetFiles[label].type.startsWith('image/') && (
                        <img src={URL.createObjectURL(assetFiles[label])} alt="preview" className="mt-1 w-24 h-16 object-cover rounded border" />
                      )}
                      {assetFiles[label].type.startsWith('video/') && (
                        <video src={URL.createObjectURL(assetFiles[label])} controls className="mt-1 w-32 h-20 rounded border" />
                      )}
                    </div>
                  )}
                  {assetErrors[label] && <div className="text-xs text-red-500 mt-1">{assetErrors[label]}</div>}
                  <div className="text-xs text-gray-400">Allowed: {accept} | Max size: {Math.round(maxSize/1024/1024)}MB</div>
                </div>
              ))}
            </section>
            {/* Prerequisites */}
            <section>
              <h3 className="text-lg font-medium mb-4">Prerequisites</h3>
              {/* TODO: Implement multi-select with a custom component if needed */}
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select prior lessons" />
                </SelectTrigger>
                <SelectContent>
                  {/* Populate with lessons from this module */}
                  <SelectItem value="1">Lesson 1</SelectItem>
                  <SelectItem value="2">Lesson 2</SelectItem>
                </SelectContent>
              </Select>
            </section>
            {/* Tags & SEO */}
            <section>
              <h3 className="text-lg font-medium mb-4">Tags & SEO</h3>
              <Input
                placeholder="Add tags (comma separated)"
                value={form.tags.join(', ')}
                onChange={e => handleChange('tags', e.target.value.split(',').map((t: string) => t.trim()))}
              />
              <Textarea
                placeholder="Meta description for search/recommendation"
                value={form.metaDescription}
                onChange={e => handleChange('metaDescription', e.target.value)}
                maxLength={160}
              />
            </section>
            {/* Publishing Options */}
            <section>
              <h3 className="text-lg font-medium mb-4">Publishing Options</h3>
              <div className="flex items-center gap-4 mb-2">
                <Label>Status</Label>
                <Switch
                  checked={form.status === 'live'}
                  onCheckedChange={checked => handleChange('status', checked ? 'live' : 'draft')}
                />
                <span>{form.status === 'live' ? 'Live' : 'Draft'}</span>
              </div>
              <Input
                type="datetime-local"
                value={form.goLiveDate}
                onChange={e => handleChange('goLiveDate', e.target.value)}
              />
            </section>
            {/* Code Challenge Section */}
            {form.type === 'code' && (
              <section className="border rounded-lg p-4 mb-8 bg-gray-50">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowCodeChallenge(v => !v)}>
                  <h3 className="text-lg font-medium">Code Challenge</h3>
                  {showCodeChallenge ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
                {showCodeChallenge && (
                  <div className="space-y-6 mt-4">
                    {/* Difficulty Picker */}
                    <div>
                      <Label>Difficulty</Label>
                      <RadioGroup value={ccDifficulty} onValueChange={setCcDifficulty} className="flex gap-4 mt-2">
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Easy" id="easy" /><Label htmlFor="easy">Easy</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Medium" id="medium" /><Label htmlFor="medium">Medium</Label></div>
                        <div className="flex items-center space-x-2"><RadioGroupItem value="Hard" id="hard" /><Label htmlFor="hard">Hard</Label></div>
                      </RadioGroup>
                    </div>
                    {/* Starter Code Editor */}
                    <div>
                      <Label>Starter Code (per language)</Label>
                      <div className="flex gap-4 flex-wrap">
                        {Object.keys(ccStarterCode).map(lang => (
                          <div key={lang} className="flex flex-col">
                            <span className="text-xs font-semibold mb-1">{lang}</span>
                            <Textarea
                              value={ccStarterCode[lang]}
                              onChange={e => setCcStarterCode({ ...ccStarterCode, [lang]: e.target.value })}
                              rows={3}
                              className="w-48"
                            />
                          </div>
                        ))}
                        {/* Add new language */}
                        <Button type="button" size="sm" variant="outline" onClick={() => setCcStarterCode({ ...ccStarterCode, java: '' })}>
                          + Java
                        </Button>
                      </div>
                    </div>
                    {/* Test Cases Table */}
                    <div>
                      <Label>Test Cases</Label>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-xs border mt-2">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="p-2">Input</th>
                              <th className="p-2">Expected</th>
                              <th className="p-2">Sample?</th>
                              <th className="p-2">Weight</th>
                              <th className="p-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {ccTestCases.map((tc, idx) => (
                              <tr key={idx}>
                                <td><Input value={tc.input} onChange={e => setCcTestCases(ccTestCases.map((t, i) => i === idx ? { ...t, input: e.target.value } : t))} /></td>
                                <td><Input value={tc.expected} onChange={e => setCcTestCases(ccTestCases.map((t, i) => i === idx ? { ...t, expected: e.target.value } : t))} /></td>
                                <td><input type="checkbox" checked={tc.isSample} onChange={e => setCcTestCases(ccTestCases.map((t, i) => i === idx ? { ...t, isSample: e.target.checked } : t))} /></td>
                                <td><Input type="number" value={tc.weight} min={1} onChange={e => setCcTestCases(ccTestCases.map((t, i) => i === idx ? { ...t, weight: Number(e.target.value) } : t))} className="w-16" /></td>
                                <td><Button type="button" size="icon" variant="ghost" onClick={() => setCcTestCases(ccTestCases.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => setCcTestCases([...ccTestCases, { input: '', expected: '', isSample: false, weight: 1 }])}><Plus className="h-4 w-4 mr-1" />Add Test Case</Button>
                      </div>
                    </div>
                    {/* Hints List */}
                    <div>
                      <Label>Hints</Label>
                      <div className="space-y-2 mt-2">
                        {ccHints.map((hint, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Input value={hint.text} onChange={e => setCcHints(ccHints.map((h, i) => i === idx ? { ...h, text: e.target.value } : h))} placeholder={`Hint #${idx + 1}`} />
                            <Button type="button" size="icon" variant="ghost" onClick={() => setCcHints(ccHints.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="outline" onClick={() => setCcHints([...ccHints, { order: ccHints.length + 1, text: '' }])}><Plus className="h-4 w-4 mr-1" />Add Hint</Button>
                      </div>
                    </div>
                    {/* Editorial Steps Accordion */}
                    <div>
                      <Label>Editorial Steps</Label>
                      <div className="space-y-2 mt-2">
                        {ccEditorialSteps.map((step, idx) => (
                          <div key={idx} className="border rounded p-2 bg-white">
                            <div className="flex items-center gap-2 mb-2">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                              <Input value={step.title} onChange={e => setCcEditorialSteps(ccEditorialSteps.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))} placeholder={`Step #${idx + 1} Title`} />
                              <Button type="button" size="icon" variant="ghost" onClick={() => setCcEditorialSteps(ccEditorialSteps.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                            <Textarea value={step.content} onChange={e => setCcEditorialSteps(ccEditorialSteps.map((s, i) => i === idx ? { ...s, content: e.target.value } : s))} placeholder="Step explanation (markdown)" rows={2} />
                            <div className="mt-2">
                              <Label>Code Sample (Python)</Label>
                              <Textarea value={step.codeSample?.python || ''} onChange={e => setCcEditorialSteps(ccEditorialSteps.map((s, i) => i === idx ? { ...s, codeSample: { ...s.codeSample, python: e.target.value } } : s))} rows={2} />
                            </div>
                          </div>
                        ))}
                        <Button type="button" size="sm" variant="outline" onClick={() => setCcEditorialSteps([...ccEditorialSteps, { order: ccEditorialSteps.length + 1, title: '', content: '', codeSample: { python: '' } }])}><Plus className="h-4 w-4 mr-1" />Add Editorial Step</Button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </ScrollArea>
        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Lesson'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ModuleForm({ ...props }) {
  const [activeTab, setActiveTab] = useState('info');
  const [lessons, setLessons] = useState([]); // Array of lesson objects
  const [showLessonPanel, setShowLessonPanel] = useState(false);
  const [lessonTypeToAdd, setLessonTypeToAdd] = useState(null);

  // ...fetch and manage module/lesson state as needed

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="info">Module Info</TabsTrigger>
        <TabsTrigger value="lessons">Lessons & Sequence</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      {/* 1. Module Info Tab */}
      <TabsContent value="info">
        <Input label="Module Title" /* ... */ />
        <Textarea label="Subtitle / Short Description" /* ... */ />
        <Select label="Track" /* ... */>
          <SelectTrigger><SelectValue placeholder="Select Track" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="bootcamp">Bootcamp</SelectItem>
            <SelectItem value="dsa">DSA</SelectItem>
            <SelectItem value="projects">Projects</SelectItem>
          </SelectContent>
        </Select>
        <RadioGroup label="Difficulty" /* ... */>
          <RadioGroupItem value="beginner" id="beginner" /> Beginner
          <RadioGroupItem value="intermediate" id="intermediate" /> Intermediate
          <RadioGroupItem value="advanced" id="advanced" /> Advanced
        </RadioGroup>
        <Input label="Estimated Time" type="number" /* ... */ /> mins
        <FileUploader label="Thumbnail" /* ... */ />
        <MultiSelect label="Tags" /* ... */ />
      </TabsContent>

      {/* 2. Lessons & Sequence Tab */}
      <TabsContent value="lessons">
        {/* Add Lesson Control */}
        <div className="flex gap-2 mb-4">
          <Select onValueChange={setLessonTypeToAdd}>
            <SelectTrigger>
              <SelectValue placeholder="+ Add Lesson" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video">Video Tutorial</SelectItem>
              <SelectItem value="code">Code Challenge</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
              <SelectItem value="article">Article/Text Tutorial</SelectItem>
              <SelectItem value="project">Project Task</SelectItem>
            </SelectContent>
          </Select>
          {/* Bulk Actions, Filter by Type, etc. */}
        </div>
        {/* Show lesson panel (slide-over) when adding/editing */}
        {showLessonPanel && (
          <LessonPanel
            type={lessonTypeToAdd}
            onClose={() => setShowLessonPanel(false)}
            onSave={lesson => {
              setLessons([...lessons, lesson]);
              setShowLessonPanel(false);
            }}
          />
        )}
        {/* Draggable Lesson List */}
        <div>
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="flex items-center gap-2 border-b py-2">
              <GripVertical className="cursor-move" />
              <span>{/* Type Icon */}</span>
              <span>{lesson.title}</span>
              <span>{lesson.estimatedTime} mins</span>
              <span>{lesson.status}</span>
              <Button size="icon" onClick={() => {/* edit */}}><Edit /></Button>
              <Button size="icon" onClick={() => {/* more actions */}}><MoreVertical /></Button>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* 3. Settings Tab */}
      <TabsContent value="settings">
        <RadioGroup label="Status" /* ... */>
          <RadioGroupItem value="draft" id="draft" /> Draft
          <RadioGroupItem value="live" id="live" /> Live
        </RadioGroup>
        <Input label="Go-Live Date" type="date" /* ... */ />
        <MultiSelect label="Prerequisites" /* ... */ />
        <Select label="Visibility" /* ... */>
          <SelectTrigger><SelectValue placeholder="Select Visibility" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="unlisted">Unlisted</SelectItem>
            <SelectItem value="private">Private</SelectItem>
          </SelectContent>
        </Select>
        {/* Completion Criteria, etc. */}
      </TabsContent>
    </Tabs>
  );
} 