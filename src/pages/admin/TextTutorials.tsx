import React, { useEffect, useState, useCallback } from 'react';
import { tutorialService, storageService } from '@/lib/amplifyServices';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Save, Clock, Image, FileText, Settings, FileCode, 
  Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, 
  AlignLeft, AlignCenter, AlignRight, Space, Code, Quote, 
  Table, Link, Image as ImageIcon, CheckSquare, Minus, 
  ChevronDown, ChevronUp, Indent, Outdent, Strikethrough, 
  Underline, Highlighter, Palette, Users, Award, Navigation, Search, Filter, SortAsc, SortDesc, ListChecks, Eraser, RefreshCw } from 'lucide-react';
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
import TurndownService from 'turndown';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

interface Tutorial {
  id: string;
  tutorialId: string;
  topicId: string;
  title: string;
  subtitle: string;
  coverImageUrl: string;
  altText: string;
  estimatedTimeMins: number;
  readingLevel: string;
  preferredLearningStyle: string[];
  storyContext: string;
  learningObjectives: string[];
  prerequisites: string[];
  biteSizeSections: {
    sectionId: string;
    heading: string;
    contentMd: string;
    humorTip: string;
    mnemonic: string;
    codeSnippet: {
      language: string;
      code: string;
      explanations: string[];
    };
    challengePrompt: string;
    sectionQuiz: any[];
    playgroundEmbedId: string;
    autoCheckSnippet: boolean;
  }[];
  keyTakeaways: string[];
  funFact: string;
  reflectionPrompt: string;
  discussionThreadUrl: string;
  progressBadge: string;
  xpPoints: number;
  streakMultiplier: boolean;
  milestoneBadges: string[];
  spacedRepetitionId: string;
  nextTutorialId: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  metaDescription: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  publishDate?: Date | { seconds: number };
  introduction?: string;
  conclusion?: string;
  images?: { url: string; alt: string }[];
  diagrams?: { url: string; alt: string }[];
  downloadableAssets?: { url: string; name: string; type: string }[];
  codeSnippets?: { url: string; name: string }[];
  slug: string;
  estimatedReadTime: number;
  filledSummary: string;
  builtInPoints: string[];
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

// Add this component at the top of the file, after the imports
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

// Add this component for the content editor with highlighting
const ContentEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);

  const handleTextSelection = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setSelection({ start, end });
    }
  };

  const applyHighlight = () => {
    if (!selection) return;
    
    const before = value.substring(0, selection.start);
    const selected = value.substring(selection.start, selection.end);
    const after = value.substring(selection.end);
    
    const newValue = `${before}==${selected}==${after}`;
    onChange(newValue);
    setSelection(null);
  };

  const removeHighlight = () => {
    if (!selection) return;
    
    const before = value.substring(0, selection.start);
    const selected = value.substring(selection.start, selection.end);
    const after = value.substring(selection.end);
    
    const newValue = `${before}${selected.replace(/==/g, '')}${after}`;
    onChange(newValue);
    setSelection(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={applyHighlight}
          disabled={!selection}
        >
          <Highlighter className="h-4 w-4 mr-2" />
          Highlight
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={removeHighlight}
          disabled={!selection}
        >
          <Eraser className="h-4 w-4 mr-2" />
          Remove Highlight
        </Button>
      </div>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onSelect={handleTextSelection}
        className="font-mono"
        rows={10}
      />
      <div className="text-sm text-gray-500">
        <p>Tip: Select text and use the highlight button to mark important content.</p>
        <p>Highlighted text will be displayed with a yellow background in the tutorial.</p>
      </div>
    </div>
  );
};

// Add this at the top of the file, after the imports
const defaultTutorial: Tutorial = {
  id: '',
  tutorialId: '',
  topicId: '',
  title: '',
  subtitle: '',
  coverImageUrl: '',
  altText: '',
  estimatedTimeMins: 0,
  readingLevel: 'medium',
  preferredLearningStyle: [],
  storyContext: '',
  learningObjectives: [],
  prerequisites: [],
  biteSizeSections: [],
  keyTakeaways: [],
  funFact: '',
  reflectionPrompt: '',
  discussionThreadUrl: '',
  progressBadge: '',
  xpPoints: 0,
  streakMultiplier: false,
  milestoneBadges: [],
  spacedRepetitionId: '',
  nextTutorialId: '',
  createdAt: new Date(),
  updatedAt: new Date(),
  body: '',
  metaDescription: '',
  category: '',
  tags: [],
  status: 'draft',
  introduction: '',
  conclusion: '',
  images: [],
  diagrams: [],
  downloadableAssets: [],
  codeSnippets: [],
  slug: '',
  estimatedReadTime: 0,
  filledSummary: '',
  builtInPoints: []
};

// Add this function to generate IDs
const generateIds = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return {
    tutorialId: `TUT-${timestamp}-${random}`,
    topicId: `TOP-${timestamp}-${random}`
  };
};

// Add this component for image upload
const ImageUpload: React.FC<{
  value: string;
  onChange: (url: string) => void;
  onError: (message: string) => void;
}> = ({ value, onChange, onError }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const downloadURL = await storageService.uploadFile(file, 'tutorial-images');
      onChange(downloadURL);
    } catch (error) {
      console.error('Error uploading image:', error);
      onError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="max-w-xs"
        />
        {uploading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        )}
      </div>
      {value && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Cover preview"
            className="w-full h-full object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onChange('')}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
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
    tutorialId: '',
    topicId: '',
    title: '',
    subtitle: '',
    coverImageUrl: '',
    altText: '',
    estimatedTimeMins: 0,
    readingLevel: '',
    preferredLearningStyle: [],
    storyContext: '',
    learningObjectives: [],
    prerequisites: [],
    biteSizeSections: [],
    keyTakeaways: [],
    funFact: '',
    reflectionPrompt: '',
    discussionThreadUrl: '',
    progressBadge: '',
    xpPoints: 0,
    streakMultiplier: false,
    milestoneBadges: [],
    spacedRepetitionId: '',
    nextTutorialId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    body: '',
    metaDescription: '',
    category: '',
    tags: [],
    status: 'draft',
    introduction: '',
    conclusion: '',
    images: [],
    diagrams: [],
    downloadableAssets: [],
    codeSnippets: [],
    slug: '',
    estimatedReadTime: 0,
    filledSummary: '',
    builtInPoints: [],
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

  const turndownService = new TurndownService();

  // Add these state variables in the TextTutorials component
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'title' | 'createdAt' | 'readingLevel'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Update the AWS Aurora save function
  const saveTutorial = async (tutorial: Tutorial) => {
      try {
        setAutoSaveStatus('saving');
      
      // Prepare the data for Aurora
      const tutorialData = {
        ...tutorial,
        introduction: tutorial.introduction || '',
        body: tutorial.body || '',
        conclusion: tutorial.conclusion || '',
        // Convert arrays to JSON strings for Aurora
        biteSizeSections: tutorial.biteSizeSections?.map(section => ({
          ...section,
          sectionQuiz: section.sectionQuiz || [],
          codeSnippet: section.codeSnippet || { language: '', code: '', explanations: [] }
        })) || [],
        preferredLearningStyle: tutorial.preferredLearningStyle || [],
        learningObjectives: tutorial.learningObjectives || [],
        prerequisites: tutorial.prerequisites || [],
        keyTakeaways: tutorial.keyTakeaways || [],
        milestoneBadges: tutorial.milestoneBadges || [],
        builtInPoints: tutorial.builtInPoints || [],
        // Ensure all required fields have default values
        filledSummary: tutorial.filledSummary || '',
        estimatedTimeMins: tutorial.estimatedTimeMins || 0,
        xpPoints: tutorial.xpPoints || 0,
        readingLevel: tutorial.readingLevel || 'medium',
        // Add timestamps
        updatedAt: new Date(),
        createdAt: tutorial.createdAt || new Date()
      };

      if (tutorial.id) {
        await tutorialService.update(tutorialData);
      } else {
        await tutorialService.create(tutorialData);
      }
      
      setAutoSaveStatus('saved');
      toast({
        title: "Success",
        description: "Tutorial saved successfully",
      });
    } catch (error) {
      console.error('Error saving tutorial:', error);
      setAutoSaveStatus('error');
      toast({
        title: "Error",
        description: "Failed to save tutorial",
        variant: "destructive",
      });
    }
  };

  // Update the loadTutorials function to handle Aurora
  const loadTutorials = async () => {
    try {
      setLoading(true);
      const loadedTutorials = await tutorialService.list();
      setTutorials(loadedTutorials);
      setError(null);
    } catch (error) {
      console.error('Error loading tutorials:', error);
      setError('Failed to load tutorials');
    } finally {
      setLoading(false);
    }
  };

  // Update the deleteTutorial function
  const deleteTutorial = async (id: string) => {
    try {
      setDeletingId(id);
      await tutorialService.delete(id);
      
      // Update local state
      setTutorials(tutorials.filter(t => t.id !== id));
        toast({
        title: "Success",
        description: "Tutorial deleted successfully",
        });
    } catch (error) {
      console.error('Error deleting tutorial:', error);
        toast({
        title: "Error",
        description: "Failed to delete tutorial",
        variant: "destructive",
        });
    } finally {
      setDeletingId(null);
    }
  };

  // Add this function to handle auto-save
  const handleAutoSave = useCallback(
    debounce(async (tutorial: Tutorial) => {
      if (tutorial.id) {
        await saveTutorial(tutorial);
      }
    }, 1000),
    []
  );

  // Update the useEffect for auto-save
  useEffect(() => {
    if (currentTutorial.id) {
      handleAutoSave(currentTutorial);
    }
  }, [currentTutorial, handleAutoSave]);

  // Add this function to handle tutorial creation
  const handleCreateTutorial = async () => {
    try {
      const newTutorial: Tutorial = {
        ...defaultTutorial,
        id: crypto.randomUUID(),
        tutorialId: currentTutorial.tutorialId || '',
        topicId: currentTutorial.topicId || '',
        title: currentTutorial.title || '',
        subtitle: currentTutorial.subtitle || '',
        coverImageUrl: currentTutorial.coverImageUrl || '',
        altText: currentTutorial.altText || '',
        estimatedTimeMins: currentTutorial.estimatedTimeMins || 0,
        readingLevel: currentTutorial.readingLevel || 'medium',
        preferredLearningStyle: currentTutorial.preferredLearningStyle || [],
        storyContext: currentTutorial.storyContext || '',
        learningObjectives: currentTutorial.learningObjectives || [],
        prerequisites: currentTutorial.prerequisites || [],
        biteSizeSections: currentTutorial.biteSizeSections || [],
        keyTakeaways: currentTutorial.keyTakeaways || [],
        funFact: currentTutorial.funFact || '',
        reflectionPrompt: currentTutorial.reflectionPrompt || '',
        discussionThreadUrl: currentTutorial.discussionThreadUrl || '',
        progressBadge: currentTutorial.progressBadge || '',
        xpPoints: currentTutorial.xpPoints || 0,
        streakMultiplier: currentTutorial.streakMultiplier || false,
        milestoneBadges: currentTutorial.milestoneBadges || [],
        spacedRepetitionId: currentTutorial.spacedRepetitionId || '',
        nextTutorialId: currentTutorial.nextTutorialId || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        filledSummary: currentTutorial.filledSummary || '',
        builtInPoints: currentTutorial.builtInPoints || [],
        body: currentTutorial.body || '',
        metaDescription: currentTutorial.metaDescription || '',
        category: currentTutorial.category || '',
        tags: currentTutorial.tags || [],
        status: currentTutorial.status || 'draft',
        introduction: currentTutorial.introduction || '',
        conclusion: currentTutorial.conclusion || '',
        images: currentTutorial.images || [],
        diagrams: currentTutorial.diagrams || [],
        downloadableAssets: currentTutorial.downloadableAssets || [],
        codeSnippets: currentTutorial.codeSnippets || [],
        slug: currentTutorial.slug || '',
        estimatedReadTime: currentTutorial.estimatedReadTime || 0
      };
      
      await saveTutorial(newTutorial);
      setTutorials([newTutorial, ...tutorials]);
      setIsAddModalOpen(false);
      setCurrentTutorial(defaultTutorial);
    } catch (error) {
      console.error('Error creating tutorial:', error);
      toast({
        title: "Error",
        description: "Failed to create tutorial",
        variant: "destructive",
      });
    }
  };

  // Add this function to handle text changes in the markdown editor
  const handleMarkdownChange = (field: keyof Tutorial, value: string) => {
    setCurrentTutorial(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const fetchTutorials = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadedTutorials = await tutorialService.list();
      setTutorials(loadedTutorials);
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
      await tutorialService.delete(id);
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

  // Helper for uploading a file to S3
  async function uploadFileToStorage(file: File, folder = 'tutorials') {
    return await storageService.uploadFile(file, folder);
  }

  // Add this function to handle paste events in the markdown editor
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    let text = e.clipboardData.getData('text/plain');

    // Always use Turndown if HTML is present and not trivial
    if (html && html !== '<meta charset="utf-8">' && html.trim() !== '') {
      const markdown = turndownService.turndown(html);
      if (markdown && markdown.trim() !== '') {
        text = markdown;
      }
    }

    // Insert the formatted text at cursor position
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newValue = target.value.substring(0, start) + text + target.value.substring(end);

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
    <div className="border rounded-lg overflow-hidden bg-white shadow mb-6">
      <EditorToolbar 
        onFormat={(format) => handleFormat(field, format)}
        onSpacing={(spacing) => handleSpacing(field, spacing)}
        onLineHeight={(height) => handleLineHeight(field, height)}
        onColor={(color) => handleColor(field, color)}
        onInsert={(type) => handleInsert(field, type)}
      />
      <div className="relative">
        <MarkdownEditor
          key={field}
          name={field}
          value={String(currentTutorial[field] ?? '')}
          onChange={(value) => handleMarkdownChange(field, value)}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="min-h-[200px] p-4"
        />
      </div>
    </div>
  );

  // Update the renderContentTab function
  const renderContentTab = () => (
    <div className="space-y-6">
      <CollapsibleSection title="Basic Information" icon={<FileText className="h-5 w-5 text-blue-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Tutorial ID</Label>
            <div className="flex gap-2">
              <Input
                value={currentTutorial.tutorialId}
                onChange={e => setCurrentTutorial({ ...currentTutorial, tutorialId: e.target.value })}
                placeholder="Enter tutorial ID"
              />
        <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentTutorial({ ...currentTutorial, tutorialId: generateIds().tutorialId })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Topic ID</Label>
            <div className="flex gap-2">
              <Input
                value={currentTutorial.topicId}
                onChange={e => setCurrentTutorial({ ...currentTutorial, topicId: e.target.value })}
                placeholder="Enter topic ID"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentTutorial({ ...currentTutorial, topicId: generateIds().topicId })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={currentTutorial.title}
              onChange={e => setCurrentTutorial({ ...currentTutorial, title: e.target.value })}
              placeholder="Enter tutorial title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={currentTutorial.subtitle}
              onChange={e => setCurrentTutorial({ ...currentTutorial, subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Media" icon={<Image className="h-5 w-5 text-green-500" />}>
        <div className="space-y-6">
          <div>
            <Label>Cover Image</Label>
            <ImageUpload
              value={currentTutorial.coverImageUrl}
              onChange={url => setCurrentTutorial({ ...currentTutorial, coverImageUrl: url })}
              onError={message => toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
              })}
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={currentTutorial.altText}
              onChange={e => setCurrentTutorial({ ...currentTutorial, altText: e.target.value })}
              placeholder="Describe the image"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Meta Information" icon={<Settings className="h-5 w-5 text-purple-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Estimated Time (minutes)</Label>
            <Input
              type="number"
              value={currentTutorial.estimatedTimeMins}
              onChange={e => setCurrentTutorial({ ...currentTutorial, estimatedTimeMins: Number(e.target.value) })}
            />
          </div>
          <div>
            <Label>Reading Level</Label>
            <Select
              value={currentTutorial.readingLevel}
              onValueChange={value => setCurrentTutorial({ ...currentTutorial, readingLevel: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Preferred Learning Style</Label>
            <MultiSelect
              value={currentTutorial.preferredLearningStyle || []}
              onChange={arr => setCurrentTutorial({ ...currentTutorial, preferredLearningStyle: arr })}
              placeholder="e.g. text, video"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Main Content" icon={<FileText className="h-5 w-5 text-indigo-500" />}>
        <div className="space-y-6">
          <div>
            <Label>Introduction</Label>
            {renderMarkdownEditor('introduction', 'Write the introduction...')}
          </div>
          <div>
            <Label>Body</Label>
            {renderMarkdownEditor('body', 'Write the main body...')}
          </div>
          <div>
            <Label>Conclusion</Label>
            {renderMarkdownEditor('conclusion', 'Write the conclusion...')}
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Bite Size Sections" icon={<List className="h-5 w-5 text-red-500" />}>
        <div className="space-y-4">
          {(currentTutorial.biteSizeSections || []).map((section, index) => (
            <div key={section.sectionId} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Section {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
          onClick={() => {
                    const newSections = [...(currentTutorial.biteSizeSections || [])];
                    newSections.splice(index, 1);
                    setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Section ID</Label>
                  <Input
                    value={section.sectionId}
                    onChange={e => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, sectionId: e.target.value };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
                <div>
                  <Label>Heading</Label>
                  <Input
                    value={section.heading}
                    onChange={e => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, heading: e.target.value };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
              </div>
              <div>
                <Label>Content (Markdown)</Label>
                <MarkdownEditor
                  key={`biteSizeSections-${index}`}
                  name={`biteSizeSections-${index}-contentMd`}
                  value={section.contentMd}
                  onChange={value => {
                    const newSections = [...(currentTutorial.biteSizeSections || [])];
                    newSections[index] = { ...section, contentMd: value };
                    setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                  }}
                  placeholder="Section content..."
                  className="min-h-[120px] p-4"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Humor Tip</Label>
                  <Input
                    value={section.humorTip}
                    onChange={e => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, humorTip: e.target.value };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
                <div>
                  <Label>Mnemonic</Label>
                  <Input
                    value={section.mnemonic}
                    onChange={e => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, mnemonic: e.target.value };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
              </div>
              <div>
                <Label>Code Snippets</Label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Language</Label>
                      <Input
                        value={section.codeSnippet?.language || ''}
                        onChange={e => {
                          const newSections = [...(currentTutorial.biteSizeSections || [])];
                          newSections[index] = {
                            ...section,
                            codeSnippet: {
                              ...section.codeSnippet,
                              language: e.target.value
                            }
                          };
                          setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                        }}
                        placeholder="e.g., javascript, python, etc."
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const newSections = [...(currentTutorial.biteSizeSections || [])];
                          const currentSnippets = section.codeSnippet?.code ? section.codeSnippet.code.split('---SPLIT---') : [];
                          const currentExplanations = section.codeSnippet?.explanations || [];
                          newSections[index] = {
                            ...section,
                            codeSnippet: {
                              ...section.codeSnippet,
                              code: [...currentSnippets, ''].join('---SPLIT---'),
                              explanations: [...currentExplanations, '']
                            }
                          };
                          setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                        }}
                      >
                        <FileCode className="h-4 w-4 mr-2" />
                        Add New Code Snippet
                      </Button>
                    </div>
                  </div>
                  
                  {/* Code Snippets List */}
                  <div className="space-y-4">
                    {(section.codeSnippet?.code ? section.codeSnippet.code.split('---SPLIT---') : ['']).map((snippet, snippetIndex) => (
                      <div key={snippetIndex} className="relative border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="text-sm font-medium">Snippet {snippetIndex + 1}</Label>
                          {snippetIndex > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => {
                                const newSections = [...(currentTutorial.biteSizeSections || [])];
                                const currentSnippets = section.codeSnippet?.code ? section.codeSnippet.code.split('---SPLIT---') : [];
                                const currentExplanations = section.codeSnippet?.explanations || [];
                                const updatedSnippets = currentSnippets.filter((_, i) => i !== snippetIndex);
                                const updatedExplanations = currentExplanations.filter((_, i) => i !== snippetIndex);
                                newSections[index] = {
                                  ...section,
                                  codeSnippet: {
                                    ...section.codeSnippet,
                                    code: updatedSnippets.join('---SPLIT---'),
                                    explanations: updatedExplanations
                                  }
                                };
                                setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm text-gray-500">Code</Label>
                            <Textarea
                              value={snippet}
                              onChange={e => {
                                const newSections = [...(currentTutorial.biteSizeSections || [])];
                                const currentSnippets = section.codeSnippet?.code ? section.codeSnippet.code.split('---SPLIT---') : [];
                                currentSnippets[snippetIndex] = e.target.value;
                                newSections[index] = {
                                  ...section,
                                  codeSnippet: {
                                    ...section.codeSnippet,
                                    code: currentSnippets.join('---SPLIT---')
                                  }
                                };
                                setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                              }}
                              placeholder="Enter your code here..."
                              className="font-mono min-h-[100px]"
                            />
                          </div>
                          <div>
                            <Label className="text-sm text-gray-500">Code Explanation</Label>
                            <Textarea
                              value={section.codeSnippet?.explanations?.[snippetIndex] || ''}
                              onChange={e => {
                                const newSections = [...(currentTutorial.biteSizeSections || [])];
                                const currentExplanations = section.codeSnippet?.explanations || [];
                                const updatedExplanations = [...currentExplanations];
                                updatedExplanations[snippetIndex] = e.target.value;
                                newSections[index] = {
                                  ...section,
                                  codeSnippet: {
                                    ...section.codeSnippet,
                                    explanations: updatedExplanations
                                  }
                                };
                                setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                              }}
                              placeholder="Explain what this code does..."
                              className="min-h-[80px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview Section */}
                  {section.codeSnippet?.code && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                      <Label className="text-sm text-gray-500 mb-2">Preview</Label>
                      <div className="space-y-6">
                        {section.codeSnippet.code.split('---SPLIT---').map((snippet, snippetIndex) => (
                          snippet && (
                            <div key={snippetIndex} className="space-y-4">
                              <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                <div className="text-xs text-gray-400 mb-2">Snippet {snippetIndex + 1}</div>
                                <pre>
                                  <code className={`language-${section.codeSnippet.language || 'plaintext'}`}>
                                    {snippet}
                                  </code>
                                </pre>
                              </div>
                              {section.codeSnippet.explanations?.[snippetIndex] && (
                                <div className="bg-white p-4 rounded-lg border">
                                  <div className="text-sm font-medium text-gray-700 mb-2">Explanation</div>
                                  <div className="prose prose-sm max-w-none">
                                    <ReactMarkdown>{section.codeSnippet.explanations[snippetIndex]}</ReactMarkdown>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label>Challenge Prompt</Label>
                <MarkdownEditor
                  key={`biteSizeSections-${index}-challengePrompt`}
                  name={`biteSizeSections-${index}-challengePrompt`}
                  value={section.challengePrompt}
                  onChange={value => {
                    const newSections = [...(currentTutorial.biteSizeSections || [])];
                    newSections[index] = { ...section, challengePrompt: value };
                    setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                  }}
                  placeholder="Enter challenge prompt"
                  className="min-h-[80px] p-4"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Playground Embed ID</Label>
                  <Input
                    value={section.playgroundEmbedId}
                    onChange={e => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, playgroundEmbedId: e.target.value };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label>Auto Check Snippet</Label>
                  <Switch
                    checked={section.autoCheckSnippet}
                    onCheckedChange={checked => {
                      const newSections = [...(currentTutorial.biteSizeSections || [])];
                      newSections[index] = { ...section, autoCheckSnippet: checked };
                      setCurrentTutorial({ ...currentTutorial, biteSizeSections: newSections });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={() => {
              const newSection = {
                sectionId: `section-${Date.now()}`,
                heading: '',
                contentMd: '',
                humorTip: '',
                mnemonic: '',
                codeSnippet: { language: '', code: '', explanations: [] },
                challengePrompt: '',
                sectionQuiz: [],
                playgroundEmbedId: '',
                autoCheckSnippet: false
              };
            setCurrentTutorial({
                ...currentTutorial,
                biteSizeSections: [...(currentTutorial.biteSizeSections || []), newSection]
              });
            }}
          >
            Add Section
          </Button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Engagement" icon={<Users className="h-5 w-5 text-yellow-500" />}>
        <div className="space-y-6">
          <div>
            <Label>Key Takeaways</Label>
            <MultiSelect
              value={currentTutorial.keyTakeaways || []}
              onChange={arr => setCurrentTutorial({ ...currentTutorial, keyTakeaways: arr })}
              placeholder="Add key takeaways"
            />
          </div>
          <div>
            <Label>Fun Fact</Label>
            {renderMarkdownEditor('funFact', 'Enter a fun fact')}
          </div>
          <div>
            <Label>Reflection Prompt</Label>
            {renderMarkdownEditor('reflectionPrompt', 'Enter a reflection prompt')}
          </div>
          <div>
            <Label>Discussion Thread URL</Label>
            <Input
              value={currentTutorial.discussionThreadUrl}
              onChange={e => setCurrentTutorial({ ...currentTutorial, discussionThreadUrl: e.target.value })}
              placeholder="Enter discussion thread URL"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Progress & Rewards" icon={<Award className="h-5 w-5 text-indigo-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Progress Badge</Label>
            <Input
              value={currentTutorial.progressBadge}
              onChange={e => setCurrentTutorial({ ...currentTutorial, progressBadge: e.target.value })}
              placeholder="Enter progress badge"
            />
          </div>
          <div>
            <Label>XP Points</Label>
            <Input
              type="number"
              value={currentTutorial.xpPoints}
              onChange={e => setCurrentTutorial({ ...currentTutorial, xpPoints: Number(e.target.value) })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>Streak Multiplier</Label>
            <Switch
              checked={!!currentTutorial.streakMultiplier}
              onCheckedChange={checked => setCurrentTutorial({ ...currentTutorial, streakMultiplier: checked })}
            />
          </div>
          <div>
            <Label>Milestone Badges</Label>
            <MultiSelect
              value={currentTutorial.milestoneBadges || []}
              onChange={arr => setCurrentTutorial({ ...currentTutorial, milestoneBadges: arr })}
              placeholder="Add milestone badges"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Navigation" icon={<Navigation className="h-5 w-5 text-teal-500" />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Spaced Repetition ID</Label>
            <Input
              value={currentTutorial.spacedRepetitionId}
              onChange={e => setCurrentTutorial({ ...currentTutorial, spacedRepetitionId: e.target.value })}
              placeholder="Enter spaced repetition ID"
            />
          </div>
          <div>
            <Label>Next Tutorial ID</Label>
            <Input
              value={currentTutorial.nextTutorialId}
              onChange={e => setCurrentTutorial({ ...currentTutorial, nextTutorialId: e.target.value })}
              placeholder="Enter next tutorial ID"
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Summary & Points" icon={<ListChecks className="h-5 w-5 text-blue-500" />}>
        <div className="space-y-6">
          <div>
            <Label>Filled Summary</Label>
            {renderMarkdownEditor('filledSummary', 'Enter a detailed summary of the tutorial')}
          </div>
          <div>
            <Label>Built-in Points</Label>
            <MultiSelect
              value={currentTutorial.builtInPoints || []}
              onChange={arr => setCurrentTutorial({ ...currentTutorial, builtInPoints: arr })}
              placeholder="Add key points"
            />
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );

  const handleEdit = (tutorial: Tutorial) => {
    setCurrentTutorial({
      ...tutorial,
      preferredLearningStyle: tutorial.preferredLearningStyle || [],
      learningObjectives: tutorial.learningObjectives || [],
      prerequisites: tutorial.prerequisites || [],
      biteSizeSections: tutorial.biteSizeSections || [],
      keyTakeaways: tutorial.keyTakeaways || [],
      milestoneBadges: tutorial.milestoneBadges || [],
    });
    setEditId(tutorial.id);
    setActiveTab('content');
    setIsAddModalOpen(true);
  };

  // Add this function to filter and sort tutorials
  const getFilteredTutorials = () => {
    let filtered = [...tutorials];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query) ||
        t.storyContext.toLowerCase().includes(query)
      );
    }
    
    // Apply reading level filter
    if (filterLevel !== 'all') {
      filtered = filtered.filter(t => t.readingLevel === filterLevel);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return ((aValue as any) - (bValue as any)) * modifier;
    });
    
    return filtered;
  };

  // Add CSS for highlighted text
  const highlightStyle = `
    .highlight {
      background-color: #fef08a;
      padding: 0 2px;
      border-radius: 2px;
    }
  `;

  // Add this to the head of the document
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = highlightStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add these functions back
  const handleAddTutorial = () => {
    const { tutorialId, topicId } = generateIds();
    setCurrentTutorial({
      ...defaultTutorial,
      tutorialId,
      topicId
            });
            setEditId(null);
            setActiveTab('content');
            setIsAddModalOpen(true);
  };

  const handleFormClose = () => {
    setIsAddModalOpen(false);
    setCurrentTutorial(defaultTutorial);
    setEditId(null);
  };

  // Update the handleSave function to ensure all required fields
  const handleSave = async () => {
    try {
      if (editId) {
        const updatedTutorial: Tutorial = {
          ...defaultTutorial,
          ...currentTutorial,
          id: editId
        };
        await saveTutorial(updatedTutorial);
        toast({
          title: 'Success',
          description: 'Tutorial updated successfully',
        });
      } else {
        await handleCreateTutorial();
      }
      setIsAddModalOpen(false);
      setEditId(null);
      loadTutorials();
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tutorial',
        variant: 'destructive',
      });
    }
  };

  // Update the handlePublish function to ensure all required fields
  const handlePublish = async () => {
    try {
      const publishedTutorial: Tutorial = {
        ...defaultTutorial,
        ...currentTutorial,
        id: currentTutorial.id || crypto.randomUUID(),
        status: 'published'
      };
      await saveTutorial(publishedTutorial);
      toast({
        title: 'Success',
        description: 'Tutorial published successfully',
      });
      setIsAddModalOpen(false);
      setEditId(null);
      loadTutorials();
    } catch (error) {
      console.error('Error publishing tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish tutorial',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Text Tutorials</h1>
            <p className="text-gray-500">Create and manage interactive tutorials</p>
          </div>
          <Button onClick={handleAddTutorial}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tutorial
        </Button>
      </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortField} onValueChange={(value: any) => setSortField(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="z-50">
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="readingLevel">Reading Level</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Tutorials Grid */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredTutorials().length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tutorials found</p>
                <Button variant="link" onClick={handleAddTutorial} className="mt-2">
                  Create your first tutorial
                </Button>
              </div>
          ) : (
              getFilteredTutorials().map(tutorial => (
                <div key={tutorial.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-lg truncate">{tutorial.title}</h2>
                      <p className="text-sm text-gray-500 truncate">{tutorial.subtitle}</p>
                    </div>
                    <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setViewId(tutorial.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(tutorial)}>
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
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">{tutorial.readingLevel}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {tutorial.estimatedTimeMins} min read
                    </Badge>
                    {tutorial.preferredLearningStyle?.map(style => (
                      <Badge key={style} variant="outline" className="text-xs">
                        {style}
                    </Badge>
                  ))}
                </div>
                  
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      Created {new Date(tutorial.createdAt).toLocaleDateString()}
                  </span>
                </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">XP:</span>
                      <span className="font-medium">{tutorial.xpPoints}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Sections:</span>
                      <span className="font-medium">{tutorial.biteSizeSections?.length || 0}</span>
                    </div>
                  </div>

                  {tutorial.filledSummary && (
                    <p className="text-sm text-gray-600 line-clamp-2">{tutorial.filledSummary}</p>
                  )}
                  {tutorial.builtInPoints && tutorial.builtInPoints.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tutorial.builtInPoints.map((point, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
      )}
      </div>

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
                  {renderContentTab()}
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
                      <SelectContent className="z-50">
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
                      value={currentTutorial.prerequisites || []}
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
                      <SelectContent className="z-50">
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
                <div className="flex flex-wrap gap-2 text-xs text-indigo-100 font-medium mt-2">
                  <span><FileText className="inline h-4 w-4 mr-1" />Slug: <span className="font-mono text-white">{selectedTutorial.slug}</span></span>
                  <Badge className="bg-blue-200 text-blue-800 ml-1">{selectedTutorial.readingLevel}</Badge>
                  <span><Clock className="inline h-4 w-4 mr-1" />{selectedTutorial.estimatedTimeMins} min</span>
                  <span>XP: <span className="font-mono text-white">{selectedTutorial.xpPoints}</span></span>
                  {selectedTutorial.category && <Badge className="bg-indigo-100 text-indigo-700 border-none">{selectedTutorial.category}</Badge>}
                  {selectedTutorial.tags && selectedTutorial.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-200 text-gray-700">{tag}</Badge>
                  ))}
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
              {/* Cover Image */}
              {selectedTutorial.coverImageUrl && (
                <div className="mb-6 flex items-center gap-4">
                  <img src={selectedTutorial.coverImageUrl} alt={selectedTutorial.altText} className="w-28 h-28 object-cover rounded shadow border bg-white" />
                  <div className="text-xs text-gray-500">{selectedTutorial.altText}</div>
                </div>
              )}
              {/* Subtitle */}
              {selectedTutorial.subtitle && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Subtitle</h3>
                  <div className="text-gray-800 bg-white rounded p-3 border shadow-sm">{selectedTutorial.subtitle}</div>
                </div>
              )}
              {/* Story Context */}
              {selectedTutorial.storyContext && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Story Context</h3>
                  <div className="prose prose-sm max-w-none bg-white rounded p-3 border shadow-sm">
                    <ReactMarkdown>{selectedTutorial.storyContext}</ReactMarkdown>
                  </div>
                </div>
              )}
              {/* Learning Objectives */}
              {selectedTutorial.learningObjectives && selectedTutorial.learningObjectives.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Learning Objectives</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutorial.learningObjectives.map((obj, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-blue-100 text-blue-700">{obj}</Badge>
                ))}
              </div>
                </div>
              )}
              {/* Key Takeaways */}
              {selectedTutorial.keyTakeaways && selectedTutorial.keyTakeaways.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Key Takeaways</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutorial.keyTakeaways.map((obj, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-700">{obj}</Badge>
                    ))}
              </div>
                </div>
              )}
              {/* Fun Fact */}
              {selectedTutorial.funFact && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Fun Fact</h3>
                  <div className="prose prose-sm max-w-none bg-white rounded p-3 border shadow-sm">
                    <ReactMarkdown>{selectedTutorial.funFact}</ReactMarkdown>
              </div>
                </div>
              )}
              {/* Reflection Prompt */}
              {selectedTutorial.reflectionPrompt && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Reflection Prompt</h3>
                  <div className="prose prose-sm max-w-none bg-white rounded p-3 border shadow-sm">
                    <ReactMarkdown>{selectedTutorial.reflectionPrompt}</ReactMarkdown>
                  </div>
                </div>
              )}
              {/* Discussion Thread URL */}
              {selectedTutorial.discussionThreadUrl && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Discussion Thread</h3>
                  <a href={selectedTutorial.discussionThreadUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{selectedTutorial.discussionThreadUrl}</a>
                </div>
              )}
              {/* Progress Badge, Streak, Milestones, Learning Style, Prereqs */}
              <div className="mb-4 flex flex-wrap gap-4 items-center border-b pb-4">
                {selectedTutorial.progressBadge && (
                  <div><span className="font-semibold">Progress Badge:</span> <Badge className="bg-yellow-100 text-yellow-700">{selectedTutorial.progressBadge}</Badge></div>
                )}
                <div><span className="font-semibold">Streak Multiplier:</span> {selectedTutorial.streakMultiplier ? <span className="text-green-600 font-semibold">Yes</span> : <span className="text-gray-400">No</span>}</div>
                {selectedTutorial.milestoneBadges && selectedTutorial.milestoneBadges.length > 0 && (
                  <div><span className="font-semibold">Milestone Badges:</span> {selectedTutorial.milestoneBadges.map((b, i) => <Badge key={i} className="bg-pink-100 text-pink-700 ml-1">{b}</Badge>)}</div>
                )}
                {selectedTutorial.preferredLearningStyle && selectedTutorial.preferredLearningStyle.length > 0 && (
                  <div><span className="font-semibold">Learning Style:</span> {selectedTutorial.preferredLearningStyle.map((s, i) => <Badge key={i} className="bg-teal-100 text-teal-700 ml-1">{s}</Badge>)}</div>
                )}
                {selectedTutorial.prerequisites && selectedTutorial.prerequisites.length > 0 && (
                  <div><span className="font-semibold">Prerequisites:</span> {selectedTutorial.prerequisites.map((p, i) => <Badge key={i} className="bg-gray-100 text-gray-700 ml-1">{p}</Badge>)}</div>
                )}
              </div>
              {/* Filled Summary */}
              {selectedTutorial.filledSummary && (
                <div className="mb-4 mt-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Summary</h3>
                  <div className="prose prose-sm max-w-none bg-white rounded p-3 border shadow-sm">
                    <ReactMarkdown>{selectedTutorial.filledSummary}</ReactMarkdown>
                  </div>
                </div>
              )}
              {/* Built-in Points */}
              {selectedTutorial.builtInPoints && selectedTutorial.builtInPoints.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Built-in Points</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTutorial.builtInPoints.map((point, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">{point}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {/* Divider */}
              <div className="my-6 border-t" />
              {/* Bite Size Sections */}
              {selectedTutorial.biteSizeSections && selectedTutorial.biteSizeSections.length > 0 && (
              <div className="mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-2 text-indigo-700">Bite Size Sections</h3>
                  <div className="space-y-4">
                    {selectedTutorial.biteSizeSections.map((section, idx) => (
                      <div key={section.sectionId || idx} className="border rounded-lg p-4 bg-white shadow-sm">
                        <div className="font-semibold mb-2 text-indigo-600">{section.heading}</div>
                        <div className="mb-2 text-xs text-gray-500">Section ID: {section.sectionId}</div>
                        {section.contentMd && (
                          <div className="mb-2">
                            <span className="font-semibold">Content:</span>
                            <div className="prose prose-sm max-w-none bg-gray-50 rounded p-2 border mt-1">
                              <ReactMarkdown>{section.contentMd}</ReactMarkdown>
                </div>
              </div>
                        )}
                        {section.humorTip && (
                          <div className="mb-2"><span className="font-semibold">Humor Tip:</span> {section.humorTip}</div>
                        )}
                        {section.mnemonic && (
                          <div className="mb-2"><span className="font-semibold">Mnemonic:</span> {section.mnemonic}</div>
                        )}
                        {section.codeSnippet && (section.codeSnippet.language || section.codeSnippet.code) && (
                          <div className="mb-2">
                            <span className="font-semibold">Code Snippet:</span>
                            <pre className="bg-gray-100 rounded p-2 mt-1 overflow-x-auto text-xs"><code>{section.codeSnippet.language && `[${section.codeSnippet.language}] `}{section.codeSnippet.code}</code></pre>
                          </div>
                        )}
                        {section.challengePrompt && (
                          <div className="mb-2"><span className="font-semibold">Challenge Prompt:</span> {section.challengePrompt}</div>
                        )}
                        {section.playgroundEmbedId && (
                          <div className="mb-2"><span className="font-semibold">Playground Embed ID:</span> {section.playgroundEmbedId}</div>
                        )}
                        <div className="mb-2"><span className="font-semibold">Auto Check Snippet:</span> {section.autoCheckSnippet ? <span className="text-green-600 font-semibold">Yes</span> : <span className="text-gray-400">No</span>}</div>
                        {section.sectionQuiz && section.sectionQuiz.length > 0 && (
                          <div className="mb-2"><span className="font-semibold">Section Quiz:</span> {JSON.stringify(section.sectionQuiz)}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Divider */}
              <div className="my-6 border-t" />
              {/* Media & Resources */}
              {(selectedTutorial.images?.length > 0 || selectedTutorial.diagrams?.length > 0) && (
                <div className="mb-6">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Images & Diagrams</h3>
                  <div className="flex flex-wrap gap-4">
                    {(selectedTutorial.images || []).map((img, i) => (
                      <img key={i} src={img.url} alt={img.alt} className="w-20 h-20 object-cover rounded shadow border bg-white" />
                    ))}
                    {(selectedTutorial.diagrams || []).map((img, i) => (
                      <img key={i} src={img.url} alt={img.alt} className="w-20 h-20 object-cover rounded shadow border bg-white" />
                    ))}
                  </div>
                </div>
              )}
              {selectedTutorial.downloadableAssets?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Downloadable Assets</h3>
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
              {selectedTutorial.codeSnippets?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-base text-indigo-700 mb-1">Code Snippets</h3>
                  <ul className="flex flex-wrap gap-4 mt-2">
                    {selectedTutorial.codeSnippets.map((snip, i) => (
                      <li key={i} className="flex items-center gap-2 bg-white border rounded px-3 py-2 shadow text-xs">
                        <a href={snip.url} target="_blank" rel="noopener noreferrer" className="underline font-medium">{snip.name}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Meta */}
              <div className="mb-2 text-xs text-gray-500 flex flex-wrap gap-4 border-t pt-4 mt-4">
                {selectedTutorial.metaDescription && <span>Meta: <span className="text-gray-700">{selectedTutorial.metaDescription}</span></span>}
                <span>Created: <span className="text-gray-700">{selectedTutorial.createdAt ? new Date(selectedTutorial.createdAt).toLocaleString() : ''}</span></span>
                <span>Updated: <span className="text-gray-700">{selectedTutorial.updatedAt ? new Date(selectedTutorial.updatedAt).toLocaleString() : ''}</span></span>
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