import React, { useEffect, useState } from 'react';
import { firestore, storage } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Save, Clock, Image, FileText, Settings, FileCode, 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, Space, Code, Quote, 
  Table, Link, Image as ImageIcon, CheckSquare, Minus, 
  ChevronDown, ChevronUp, Indent, Outdent, Strikethrough, 
  Underline, Highlighter, Palette } from 'lucide-react';
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

// Helper for Firestore Timestamp
function isFirestoreTimestamp(obj: any): obj is { seconds: number } {
  return obj && typeof obj === 'object' && typeof obj.seconds === 'number';
}

// Add this constant for local storage key
const DRAFT_TUTORIAL_KEY = 'draft_tutorial_data';

// Add this interface for editor toolbar
interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onSpacing: (spacing: number) => void;
  onLineHeight: (height: number) => void;
  onColor: (color: string) => void;
  onInsert: (type: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ 
  onFormat, 
  onSpacing, 
  onLineHeight,
  onColor,
  onInsert 
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border-b rounded-t">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onFormat('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('underline')} title="Underline">
          <Underline className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('strikethrough')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('highlight')} title="Highlight">
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onFormat('h1')} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('h2')} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('h3')} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists and Indentation */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onFormat('ul')} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('ol')} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('checklist')} title="Checklist">
          <CheckSquare className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('indent')} title="Indent">
          <Indent className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('outdent')} title="Outdent">
          <Outdent className="h-4 w-4" />
        </Button>
      </div>

      {/* Alignment and Spacing */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onFormat('align-left')} title="Align Left">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('align-center')} title="Align Center">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('align-right')} title="Align Right">
          <AlignRight className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
          <Space className="h-4 w-4 text-gray-500" />
          <select 
            className="text-sm border rounded px-2 py-1"
            onChange={(e) => onSpacing(Number(e.target.value))}
          >
            <option value="1">Single Space</option>
            <option value="2">Double Space</option>
            <option value="3">Triple Space</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <ChevronUp className="h-4 w-4 text-gray-500" />
          <select 
            className="text-sm border rounded px-2 py-1"
            onChange={(e) => onLineHeight(Number(e.target.value))}
          >
            <option value="1">1.0</option>
            <option value="1.5">1.5</option>
            <option value="2">2.0</option>
            <option value="2.5">2.5</option>
          </select>
        </div>
      </div>

      {/* Special Formatting */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onFormat('code')} title="Code">
          <Code className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('quote')} title="Quote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onFormat('horizontal-rule')} title="Horizontal Rule">
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      {/* Insert Options */}
      <div className="flex gap-1 border-r pr-2">
        <Button size="sm" variant="ghost" onClick={() => onInsert('link')} title="Insert Link">
          <Link className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onInsert('image')} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onInsert('table')} title="Insert Table">
          <Table className="h-4 w-4" />
        </Button>
      </div>

      {/* Color Options */}
      <div className="flex items-center gap-1">
        <Palette className="h-4 w-4 text-gray-500" />
        <input 
          type="color" 
          className="w-8 h-8 p-0 border-0"
          onChange={(e) => onColor(e.target.value)}
        />
      </div>
    </div>
  );
};

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

  // Modify the useEffect for auto-save to include local storage
  useEffect(() => {
    if (!isAddModalOpen) return;

    const autoSaveTimer = setInterval(async () => {
      try {
        setAutoSaveStatus('saving');
        saveDraftToLocalStorage(currentTutorial);
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
        variant: 'default',
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

  // Add this function to save draft to local storage
  const saveDraftToLocalStorage = (tutorial: Partial<Tutorial>) => {
    try {
      if (tutorial.title || tutorial.body) {
        localStorage.setItem(DRAFT_TUTORIAL_KEY, JSON.stringify({
          ...tutorial,
          lastSaved: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Failed to save draft to local storage:', err);
    }
  };

  // Add this function to load draft from local storage
  const loadDraftFromLocalStorage = (): Partial<Tutorial> | null => {
    try {
      const saved = localStorage.getItem(DRAFT_TUTORIAL_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Remove the lastSaved field when loading
        const { lastSaved, ...tutorial } = parsed;
        return tutorial;
      }
      return null;
    } catch (err) {
      console.error('Failed to load draft from local storage:', err);
      return null;
    }
  };

  // Modify the handleFormClose function
  const handleFormClose = () => {
    if (currentTutorial.title || currentTutorial.body) {
      saveDraftToLocalStorage(currentTutorial);
      toast({
        title: 'Draft Saved',
        description: 'Your changes have been saved as a draft',
      });
    }
    setIsAddModalOpen(false);
  };

  // Modify the handleAddTutorial function
  const handleAddTutorial = () => {
    const savedDraft = loadDraftFromLocalStorage();
    if (savedDraft) {
      toast({
        title: 'Draft Loaded',
        description: 'Your previous draft has been loaded',
      });
    }
    setCurrentTutorial(savedDraft || {
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
  };

  // Modify the handleSave function
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
      localStorage.removeItem(DRAFT_TUTORIAL_KEY);
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

  // Modify the handlePublish function
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

      localStorage.removeItem(DRAFT_TUTORIAL_KEY);
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

  // Add this function to handle text changes in the markdown editor
  const handleMarkdownChange = (field: keyof Tutorial, value: string) => {
    setCurrentTutorial(prev => ({
      ...prev,
      [field]: value
    }));
    // Auto-save on change
    saveDraftToLocalStorage({
      ...currentTutorial,
      [field]: value
    });
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

  // Add this function to handle paste events in the markdown editor
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    // Format the pasted text to preserve markdown formatting
    const formattedText = text
      .replace(/\n\n/g, '\n\n') // Preserve double line breaks
      .replace(/\n/g, ' ') // Replace single line breaks with spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    // Insert the formatted text at cursor position
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newValue = target.value.substring(0, start) + formattedText + target.value.substring(end);
    
    // Update the current tutorial state
    const field = target.name;
    setCurrentTutorial(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // Add this function to handle formatting
  const handleFormat = (field: keyof Tutorial, format: string) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'code':
        formattedText = `\`${selectedText}\``;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'h1':
        formattedText = `# ${selectedText}`;
        break;
      case 'h2':
        formattedText = `## ${selectedText}`;
        break;
      case 'h3':
        formattedText = `### ${selectedText}`;
        break;
      case 'ul':
        formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
        break;
      case 'ol':
        formattedText = selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
        break;
      case 'align-left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        break;
      case 'align-center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        break;
      case 'align-right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'highlight':
        formattedText = `<mark>${selectedText}</mark>`;
        break;
      case 'checklist':
        formattedText = selectedText.split('\n').map(line => `- [ ] ${line}`).join('\n');
        break;
      case 'indent':
        formattedText = selectedText.split('\n').map(line => `    ${line}`).join('\n');
        break;
      case 'outdent':
        formattedText = selectedText.split('\n').map(line => line.replace(/^    /, '')).join('\n');
        break;
      case 'horizontal-rule':
        formattedText = '\n---\n';
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    handleMarkdownChange(field, newValue);
  };

  // Add this function to handle spacing
  const handleSpacing = (field: keyof Tutorial, spacing: number) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const lines = selectedText.split('\n');
    const spacedLines = lines.map(line => line + '\n'.repeat(spacing - 1));
    const formattedText = spacedLines.join('\n');

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    handleMarkdownChange(field, newValue);
  };

  // Add this function to handle line height
  const handleLineHeight = (field: keyof Tutorial, height: number) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const formattedText = `<div style="line-height: ${height}">${selectedText}</div>`;

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    handleMarkdownChange(field, newValue);
  };

  // Add this function to handle color
  const handleColor = (field: keyof Tutorial, color: string) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const formattedText = `<span style="color: ${color}">${selectedText}</span>`;

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    handleMarkdownChange(field, newValue);
  };

  // Add this function to handle insertions
  const handleInsert = (field: keyof Tutorial, type: string) => {
    const textarea = document.querySelector(`textarea[name="${field}"]`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    let insertText = '';

    switch (type) {
      case 'link':
        insertText = '[Link Text](url)';
        break;
      case 'image':
        insertText = '![Alt Text](image-url)';
        break;
      case 'table':
        insertText = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |`;
        break;
      default:
        return;
    }

    const newValue = textarea.value.substring(0, start) + insertText + textarea.value.substring(start);
    handleMarkdownChange(field, newValue);
  };

  // Modify the renderMarkdownEditor function
  const renderMarkdownEditor = (field: keyof Tutorial, placeholder: string) => (
    <div className="border rounded-lg overflow-hidden">
      <EditorToolbar 
        onFormat={(format) => handleFormat(field, format)}
        onSpacing={(spacing) => handleSpacing(field, spacing)}
        onLineHeight={(height) => handleLineHeight(field, height)}
        onColor={(color) => handleColor(field, color)}
        onInsert={(type) => handleInsert(field, type)}
      />
      <div className="relative">
        <MarkdownEditor
          value={currentTutorial[field] as string}
          onChange={(value) => handleMarkdownChange(field, value)}
          placeholder={placeholder}
          className="min-h-[200px] p-4"
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Text Tutorials</h1>
        <Button
          onClick={handleAddTutorial}
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
              <Button variant="ghost" onClick={handleFormClose}>×</Button>
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
                    {renderMarkdownEditor('introduction', 'Enter a short lead-in paragraph...')}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body" className="font-semibold">Body <span className="text-red-500">*</span></Label>
                    <div className="text-xs text-muted-foreground mb-1">Main content. Supports Markdown, code blocks, and LaTeX.</div>
                    {renderMarkdownEditor('body', 'Enter the main content...')}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="conclusion" className="font-semibold">Conclusion / Summary</Label>
                    <div className="text-xs text-muted-foreground mb-1">Key takeaways or next steps.</div>
                    {renderMarkdownEditor('conclusion', 'Enter key takeaways and next steps...')}
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
                          ? (isFirestoreTimestamp(currentTutorial.publishDate)
                              ? new Date(currentTutorial.publishDate.seconds * 1000)
                              : new Date(currentTutorial.publishDate as any)
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
                <Button variant="outline" onClick={handleFormClose}>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-t-2xl px-8 py-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                  {selectedTutorial.title}
                  <span className={
                    selectedTutorial.status === 'published'
                      ? 'bg-green-600 text-white text-xs px-2 py-1 rounded ml-2'
                      : 'bg-yellow-500 text-white text-xs px-2 py-1 rounded ml-2'
                  }>
                    {selectedTutorial.status}
                  </span>
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-indigo-100 font-medium">
                  <span><FileText className="inline h-4 w-4 mr-1" />Slug: <span className="font-mono text-white">{selectedTutorial.slug}</span></span>
                  {selectedTutorial.publishDate && (
                    <span><Clock className="inline h-4 w-4 mr-1" />Published: {
                      (selectedTutorial.publishDate instanceof Date)
                        ? selectedTutorial.publishDate.toLocaleString()
                        : isFirestoreTimestamp(selectedTutorial.publishDate as any)
                          ? new Date((selectedTutorial.publishDate as any).seconds * 1000).toLocaleString()
                          : ''
                    }</span>
                  )}
                  <span><Badge className="bg-blue-200 text-blue-800 ml-1">{selectedTutorial.readingLevel}</Badge></span>
                  <span><Clock className="inline h-4 w-4 mr-1" />{selectedTutorial.estimatedReadTime} min read</span>
                </div>
              </div>
              <button
                className="text-2xl text-white hover:text-indigo-200 focus:outline-none ml-4"
                onClick={() => setViewId(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-8 py-6 bg-gray-50 rounded-b-2xl">
              {/* Tags & Category */}
              <div className="mb-4 flex flex-wrap gap-2 items-center">
                <Badge variant="secondary" className="capitalize bg-indigo-100 text-indigo-700 border-none">{selectedTutorial.category}</Badge>
                {selectedTutorial.tags && selectedTutorial.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-200 text-gray-700">{tag}</Badge>
                ))}
              </div>
              {/* Introduction */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-indigo-400" />Introduction</h3>
                <div className="prose prose-sm max-w-none bg-white rounded p-4 border">
                  <ReactMarkdown>{selectedTutorial.introduction}</ReactMarkdown>
                </div>
              </div>
              {/* Body */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-indigo-400" />Body</h3>
                <div className="prose prose-sm max-w-none bg-white rounded p-4 border">
                  <ReactMarkdown>{selectedTutorial.body}</ReactMarkdown>
                </div>
              </div>
              {/* Conclusion */}
              <div className="mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-indigo-400" />Conclusion</h3>
                <div className="prose prose-sm max-w-none bg-white rounded p-4 border">
                  <ReactMarkdown>{selectedTutorial.conclusion}</ReactMarkdown>
                </div>
              </div>
              {/* Images & Diagrams */}
              {(selectedTutorial.images?.length > 0 || selectedTutorial.diagrams?.length > 0) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><Image className="h-5 w-5 text-indigo-400" />Images & Diagrams</h3>
                  <div className="flex flex-wrap gap-4">
                    {(selectedTutorial.images || []).map((img, i) => (
                      <img key={i} src={img.url} alt={img.alt} className="w-24 h-24 object-cover rounded shadow border bg-white" />
                    ))}
                    {(selectedTutorial.diagrams || []).map((img, i) => (
                      <img key={i} src={img.url} alt={img.alt} className="w-24 h-24 object-cover rounded shadow border bg-white" />
                    ))}
                  </div>
                </div>
              )}
              {/* Downloadable Assets */}
              {selectedTutorial.downloadableAssets?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileText className="h-5 w-5 text-indigo-400" />Downloadable Assets</h3>
                  <ul className="flex flex-wrap gap-4 mt-2">
                    {selectedTutorial.downloadableAssets.map((asset, i) => (
                      <li key={i} className="flex items-center gap-2 bg-white border rounded px-3 py-2 shadow text-xs">
                        <a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline font-medium">{asset.name}</a>
                        <span className="text-gray-400">({asset.type})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Code Snippets */}
              {selectedTutorial.codeSnippets?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2"><FileCode className="h-5 w-5 text-indigo-400" />Code Snippets</h3>
                  <ul className="flex flex-wrap gap-4 mt-2">
                    {selectedTutorial.codeSnippets.map((snip, i) => (
                      <li key={i} className="flex items-center gap-2 bg-white border rounded px-3 py-2 shadow text-xs">
                        <a href={snip.url} target="_blank" rel="noopener noreferrer" className="underline font-medium">{snip.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Meta & Prerequisites */}
              <div className="mb-2 text-xs text-gray-500 flex flex-wrap gap-4">
                <span>Meta Description: <span className="text-gray-700">{selectedTutorial.metaDescription}</span></span>
                <span>Prerequisites: <span className="text-gray-700">{(selectedTutorial.prerequisites || []).join(', ')}</span></span>
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={() => setViewId(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded shadow">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 