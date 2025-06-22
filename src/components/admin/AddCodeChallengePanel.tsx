import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { generateClient } from 'aws-amplify/api';
import * as mutations from '@/graphql/mutations';
import MonacoEditor from "@monaco-editor/react";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { toast } from 'sonner';

const client = generateClient();

interface AddCodeChallengePanelProps {
  onClose: () => void;
  initialData?: any;
}

const TABS = [
  'Core Info',
  'Constraints & Examples',
  'Learning Aids',
  'Community & Analytics',
  'Additional Info',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TAGS = ['arrays', 'hash-table', 'math', 'two-pointers', 'sorting', 'greedy'];
const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const DEFAULT_TEMPLATES = {
  python: {
    starter_code: `def solution():
    # Write your code here
    pass`,
    solution_code: `def solution():
    # Solution code here
    pass`
  },
  javascript: {
    starter_code: `function solution() {
    // Write your code here
}`,
    solution_code: `function solution() {
    // Solution code here
}`
  },
  java: {
    starter_code: `public class Solution {
    public void solution() {
        // Write your code here
    }
}`,
    solution_code: `public class Solution {
    public void solution() {
        // Solution code here
    }
}`
  },
  cpp: {
    starter_code: `class Solution {
public:
    void solution() {
        // Write your code here
    }
};`,
    solution_code: `class Solution {
public:
    void solution() {
        // Solution code here
    }
};`
  }
};

// Add these new interfaces after the existing interfaces
interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface Step {
  step_number: number;
  explanation: string;
  pseudocode: string;
}

interface FormErrors {
  title?: string;
  slug?: string;
  description?: string;
  difficulty?: string;
  xp_points?: string;
  time_limit_ms?: string;
  memory_limit_mb?: string;
  input_constraints?: string;
  examples?: string;
  sample_tests?: string;
  hidden_tests?: string;
  code_templates?: string;
}

// Add this interface near the top with other interfaces
interface ChallengeData {
  // Core Identity
  title: string;
  slug: string;
  description: string;
  tags: string[];
  difficulty: string;
  xp_points: number;
  
  // Code Templates
  code_templates: {
    [key: string]: {
      starter_code: string;
      solution_code: string;
    };
  };
  
  // Constraints & Limits
  time_limit_ms: number;
  memory_limit_mb: number;
  input_constraints: string;
  
  // Examples & Testcases
  examples: Example[];
  sample_tests: TestCase[];
  hidden_tests: TestCase[];
  
  // Learning Aids
  hints: string[];
  algorithm_overview: string;
  step_by_step_solution: Step[];
  full_editorial: string;
  
  // Community & Discussion
  discussion_enabled: boolean;
  discussion_threads: string[];
  comments_count: number;
  
  // Submission Analytics
  submissions_count: number;
  accepted_count: number;
  acceptance_rate: number;
  average_runtime_ms: number;
  average_memory_mb: number;
  
  // Contest & Organizational
  company_tags: string[];
  contest_id: string;
  premium_only: boolean;
  
  // Localization & Media
  translations: { [key: string]: { title: string; description: string } };
  diagram_images: string[];
  solution_videos: string[];
  
  // Auditing & Versioning
  created_at?: any;
  updated_at: any;
  version: number;
}

export function AddCodeChallengePanel({ onClose, initialData }: AddCodeChallengePanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    // Core Identity
    title: '',
    slug: '',
    description: '',
    tags: [] as string[],
    difficulty: 'Easy',
    xp_points: 10,
    
    // Code Templates
    code_templates: initialData?.code_templates || { ...DEFAULT_TEMPLATES },
    
    // Constraints & Limits
    time_limit_ms: 1000,
    memory_limit_mb: 256,
    input_constraints: '',
    
    // Examples & Testcases
    examples: [] as { input: string; output: string; explanation: string }[],
    sample_tests: [] as { input: string; output: string }[],
    hidden_tests: [] as { input: string; output: string }[],
    
    // Learning Aids
    hints: [] as string[],
    algorithm_overview: '',
    step_by_step_solution: [] as { step_number: number; explanation: string; pseudocode: string }[],
    full_editorial: '',
    
    // Community & Discussion
    discussion_enabled: true,
    discussion_threads: [] as string[],
    comments_count: 0,
    
    // Submission Analytics
    submissions_count: 0,
    accepted_count: 0,
    acceptance_rate: 0,
    average_runtime_ms: 0,
    average_memory_mb: 0,
    
    // Contest & Organizational
    company_tags: [] as string[],
    contest_id: '',
    premium_only: false,
    
    // Localization & Media
    translations: {} as { [key: string]: { title: string; description: string } },
    diagram_images: [] as string[],
    solution_videos: [] as string[],
    
    // Auditing & Versioning
    created_by: '',
    updated_by: '',
    created_at: null as any,
    updated_at: null as any,
    version: 1,
  });

  // State for UI controls
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(TAGS);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Add these new state variables in the component
  const [examples, setExamples] = useState<Example[]>([]);
  const [sampleTests, setSampleTests] = useState<TestCase[]>([]);
  const [hiddenTests, setHiddenTests] = useState<TestCase[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [companyTags, setCompanyTags] = useState<string[]>([]);
  const [newCompanyTag, setNewCompanyTag] = useState('');
  const [showNewCompanyTagInput, setShowNewCompanyTagInput] = useState(false);
  const [diagramImages, setDiagramImages] = useState<string[]>([]);
  const [solutionVideos, setSolutionVideos] = useState<string[]>([]);

  // Add new state for validation
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Add new state for code templates
  const [selectedLanguage, setSelectedLanguage] = useState('python');
  const [showSolutionCode, setShowSolutionCode] = useState(false);

  // Add this effect to ensure code templates are initialized
  useEffect(() => {
    if (!form.code_templates || Object.keys(form.code_templates).length === 0) {
      handleFormChange({ code_templates: { ...DEFAULT_TEMPLATES } });
    }
  }, []);

  // Improve initial data loading with better synchronization
  useEffect(() => {
    if (initialData) {
      // First set the form data
      setForm({
        ...initialData,
        // Ensure all required fields have default values
        tags: initialData.tags || [],
        hints: initialData.hints || [],
        discussion_threads: initialData.discussion_threads || [],
        company_tags: initialData.company_tags || [],
        translations: initialData.translations || {},
        diagram_images: initialData.diagram_images || [],
        solution_videos: initialData.solution_videos || [],
      });

      // Then sync all the separate states
      setExamples(initialData.examples || []);
      setSampleTests(initialData.sample_tests || []);
      setHiddenTests(initialData.hidden_tests || []);
      setSteps(initialData.step_by_step_solution || []);
      setCompanyTags(initialData.company_tags || []);
      setDiagramImages(initialData.diagram_images || []);
      setSolutionVideos(initialData.solution_videos || []);
      setTags(initialData.tags || TAGS);
    }
  }, [initialData]);

  // Improve form change handler to track all changes
  const handleFormChange = (updates: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
    
    // Clear relevant errors when field is updated
    Object.keys(updates).forEach(key => {
      if (errors[key as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [key]: undefined }));
      }
    });
  };

  // Add handlers for all form fields
  const handleFieldChange = (field: keyof typeof form, value: any) => {
    handleFormChange({ [field]: value });
  };

  // Add handlers for array fields
  const handleArrayFieldChange = (field: keyof typeof form, index: number, value: any) => {
    const currentArray = [...(form[field] as any[])];
    currentArray[index] = value;
    handleFormChange({ [field]: currentArray });
  };

  // Add handlers for nested fields
  const handleNestedFieldChange = (field: keyof typeof form, nestedField: string, value: any) => {
    handleFormChange({
      [field]: {
        ...(form[field] as any),
        [nestedField]: value
      }
    });
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    const slug = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(prev => ({
      ...prev,
      title: val,
      slug: slug
    }));
    
    if (errors.slug) {
      setErrors(e => ({ ...e, slug: undefined }));
    }
  };

  // Tag selection
  const handleTagToggle = (tag: string) => {
    handleFieldChange('tags', form.tags.includes(tag)
      ? form.tags.filter(t => t !== tag)
      : [...form.tags, tag]
    );
  };

  // Add these new helper functions in the component
  const handleAddExample = () => {
    setExamples([...examples, { input: '', output: '', explanation: '' }]);
  };

  const handleUpdateExample = (index: number, field: keyof Example, value: string) => {
    const newExamples = [...examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setExamples(newExamples);
  };

  const handleDeleteExample = (index: number) => {
    setExamples(examples.filter((_, i) => i !== index));
  };

  const handleAddTest = (type: 'sample' | 'hidden') => {
    const newTest = { input: '', output: '' };
    if (type === 'sample') {
      setSampleTests([...sampleTests, newTest]);
    } else {
      setHiddenTests([...hiddenTests, newTest]);
    }
  };

  const handleUpdateTest = (type: 'sample' | 'hidden', index: number, field: keyof TestCase, value: string) => {
    if (type === 'sample') {
      const newTests = [...sampleTests];
      newTests[index] = { ...newTests[index], [field]: value };
      setSampleTests(newTests);
    } else {
      const newTests = [...hiddenTests];
      newTests[index] = { ...newTests[index], [field]: value };
      setHiddenTests(newTests);
    }
  };

  const handleDeleteTest = (type: 'sample' | 'hidden', index: number) => {
    if (type === 'sample') {
      setSampleTests(sampleTests.filter((_, i) => i !== index));
    } else {
      setHiddenTests(hiddenTests.filter((_, i) => i !== index));
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { step_number: steps.length + 1, explanation: '', pseudocode: '' }]);
  };

  const handleUpdateStep = (index: number, field: keyof Step, value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const handleDeleteStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleAddCompanyTag = () => {
    if (newCompanyTag.trim()) {
      setCompanyTags([...companyTags, newCompanyTag.trim()]);
      setNewCompanyTag('');
      setShowNewCompanyTagInput(false);
    }
  };

  const handleDeleteCompanyTag = (tag: string) => {
    setCompanyTags(companyTags.filter(t => t !== tag));
  };

  // Hints handlers (using form.hints)
  const handleAddHint = () => {
    const newHints = [...form.hints, ''];
    handleFormChange({ hints: newHints });
    setIsDirty(true);
  };

  const handleUpdateHint = (index: number, value: string) => {
    const newHints = [...form.hints];
    newHints[index] = value;
    handleFormChange({ hints: newHints });
    setIsDirty(true);
  };

  const handleDeleteHint = (index: number) => {
    const newHints = form.hints.filter((_, i) => i !== index);
    handleFormChange({ hints: newHints });
    setIsDirty(true);
  };

  // Update the language selection handler
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    // Initialize template if it doesn't exist
    if (!form.code_templates[lang]) {
      const newTemplates = { ...form.code_templates };
      newTemplates[lang] = DEFAULT_TEMPLATES[lang as keyof typeof DEFAULT_TEMPLATES] || {
        starter_code: '',
        solution_code: ''
      };
      handleFormChange({ code_templates: newTemplates });
    }
  };

  // Tab content renderers
  const renderTab = () => {
    switch (activeTab) {
      case 0: // Core Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Title</label>
              <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Two Sum" />
            </div>
            <div>
              <label className="block font-medium mb-1">Slug / URL ID</label>
              <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. two-sum" />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <MarkdownEditor
                value={form.description}
                onChange={value => setForm(f => ({ ...f, description: value }))}
                placeholder="Full prompt with examples, constraints (Markdown supported)"
                className="min-h-[200px]"
              />
            </div>
            <div className="flex gap-4">
            <div>
              <label className="block font-medium mb-1">Difficulty</label>
              <Select value={form.difficulty} onValueChange={val => setForm(f => ({ ...f, difficulty: val }))}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
              </div>
              <div>
                <label className="block font-medium mb-1">XP Points</label>
                <Input
                  type="number"
                  min="0"
                  value={form.xp_points}
                  onChange={e => setForm(f => ({ ...f, xp_points: parseInt(e.target.value) || 10 }))}
                  className="w-32"
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 items-center">
                {tags.map(tag => (
                  <Badge
                    key={tag}
                    variant={form.tags.includes(tag) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {!showNewTagInput && (
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={() => setShowNewTagInput(true)}>+ New Tag</Button>
                )}
                {showNewTagInput && (
                  <div className="flex items-center gap-2 ml-2">
                    <Input
                      size={8}
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      placeholder="New tag"
                      className="w-28"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newTag.trim()) {
                          setTags([...tags, newTag.trim()]);
                          setForm(f => ({ ...f, tags: [...f.tags, newTag.trim()] }));
                          setNewTag('');
                          setShowNewTagInput(false);
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={() => {
                      if (newTag.trim()) {
                        setTags([...tags, newTag.trim()]);
                        setForm(f => ({ ...f, tags: [...f.tags, newTag.trim()] }));
                        setNewTag('');
                        setShowNewTagInput(false);
                      }
                    }}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowNewTagInput(false); setNewTag(''); }}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Code Templates Section */}
            <div>
              <label className="block font-medium mb-2">Code Templates</label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="showSolution"
                      checked={showSolutionCode}
                      onChange={e => setShowSolutionCode(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="showSolution" className="text-sm">Show Solution Code</label>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                    <span className="font-medium">
                      {showSolutionCode ? 'Solution Code' : 'Starter Code'} ({LANGUAGES.find(l => l.value === selectedLanguage)?.label})
                    </span>
                  </div>
                  <div className="h-[300px]">
                    <MonacoEditor
                      height="300px"
                      language={selectedLanguage}
                      value={showSolutionCode 
                        ? (form.code_templates?.[selectedLanguage]?.solution_code || '')
                        : (form.code_templates?.[selectedLanguage]?.starter_code || '')
                      }
                      onChange={(value) => {
                        const newTemplates = { ...form.code_templates };
                        if (!newTemplates[selectedLanguage]) {
                          newTemplates[selectedLanguage] = { starter_code: '', solution_code: '' };
                        }
                        if (showSolutionCode) {
                          newTemplates[selectedLanguage].solution_code = value || '';
                        } else {
                          newTemplates[selectedLanguage].starter_code = value || '';
                        }
                        handleFormChange({ code_templates: newTemplates });
                      }}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 1: // Constraints & Examples
        return (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div>
                <label className="block font-medium mb-1">Time Limit (ms)</label>
                <Input type="number" min={100} value={form.time_limit_ms} onChange={e => setForm(f => ({ ...f, time_limit_ms: Number(e.target.value) }))} className="w-32" />
              </div>
              <div>
                <label className="block font-medium mb-1">Memory Limit (MB)</label>
                <Input type="number" min={32} value={form.memory_limit_mb} onChange={e => setForm(f => ({ ...f, memory_limit_mb: Number(e.target.value) }))} className="w-32" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Input Constraints</label>
              <MarkdownEditor
                value={form.input_constraints}
                onChange={value => setForm(f => ({ ...f, input_constraints: value }))}
                placeholder="e.g. 1 ≤ N ≤ 10^5"
                className="min-h-[100px]"
              />
            </div>
            
            {/* Examples Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">Examples</label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddExample}>+ Add Example</Button>
              </div>
              <div className="space-y-4">
                {examples.map((example, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Example {idx + 1}</h4>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteExample(idx)}>Delete</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Input</label>
                        <Textarea value={example.input} onChange={e => handleUpdateExample(idx, 'input', e.target.value)} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Output</label>
                        <Textarea value={example.output} onChange={e => handleUpdateExample(idx, 'output', e.target.value)} rows={2} />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Explanation</label>
                      <MarkdownEditor
                        value={example.explanation}
                        onChange={value => handleUpdateExample(idx, 'explanation', value)}
                        placeholder="Explain the example..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Cases Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">Sample Tests</label>
                <Button type="button" size="sm" variant="outline" onClick={() => handleAddTest('sample')}>+ Add Sample Test</Button>
              </div>
              <div className="space-y-4">
                {sampleTests.map((test, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Sample Test {idx + 1}</h4>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteTest('sample', idx)}>Delete</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Input</label>
                        <Textarea value={test.input} onChange={e => handleUpdateTest('sample', idx, 'input', e.target.value)} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Output</label>
                        <Textarea value={test.output} onChange={e => handleUpdateTest('sample', idx, 'output', e.target.value)} rows={2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">Hidden Tests</label>
                <Button type="button" size="sm" variant="outline" onClick={() => handleAddTest('hidden')}>+ Add Hidden Test</Button>
              </div>
              <div className="space-y-4">
                {hiddenTests.map((test, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Hidden Test {idx + 1}</h4>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteTest('hidden', idx)}>Delete</Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Input</label>
                        <Textarea value={test.input} onChange={e => handleUpdateTest('hidden', idx, 'input', e.target.value)} rows={2} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Output</label>
                        <Textarea value={test.output} onChange={e => handleUpdateTest('hidden', idx, 'output', e.target.value)} rows={2} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 2: // Learning Aids
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Hints</label>
              <div className="space-y-4">
                {form.hints.map((hint, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Textarea 
                      value={hint} 
                      onChange={e => handleUpdateHint(idx, e.target.value)} 
                      rows={2} 
                      placeholder="Enter a hint..."
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleDeleteHint(idx)}
                      className="shrink-0"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  onClick={handleAddHint}
                  className="w-full"
                >
                  + Add Hint
                </Button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Algorithm Overview</label>
              <MarkdownEditor
                value={form.algorithm_overview}
                onChange={value => handleFormChange({ algorithm_overview: value })}
                placeholder="High-level approach description"
                className="min-h-[150px]"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">Step-by-Step Solution</label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddStep}>+ Add Step</Button>
              </div>
              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Step {step.step_number}</h4>
                      <Button type="button" size="sm" variant="ghost" onClick={() => handleDeleteStep(idx)}>Delete</Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Explanation</label>
                        <MarkdownEditor
                          value={step.explanation}
                          onChange={value => handleUpdateStep(idx, 'explanation', value)}
                          placeholder="Explain this step..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Pseudocode</label>
                        <MarkdownEditor
                          value={step.pseudocode}
                          onChange={value => handleUpdateStep(idx, 'pseudocode', value)}
                          placeholder="Write pseudocode for this step..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Full Editorial</label>
              <MarkdownEditor
                value={form.full_editorial}
                onChange={value => handleFormChange({ full_editorial: value })}
                placeholder="Complete write-up with code samples"
                className="min-h-[300px]"
              />
            </div>
          </div>
        );
      case 3: // Community & Analytics
        return (
          <div className="space-y-6">
              <div>
              <label className="block font-medium mb-1">Discussion Settings</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.discussion_enabled}
                  onChange={e => setForm(f => ({ ...f, discussion_enabled: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span>Enable Discussion</span>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Analytics</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Submissions Count</label>
                  <Input type="number" value={form.submissions_count} onChange={e => setForm(f => ({ ...f, submissions_count: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Accepted Count</label>
                  <Input type="number" value={form.accepted_count} onChange={e => setForm(f => ({ ...f, accepted_count: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Acceptance Rate</label>
                  <Input type="number" value={form.acceptance_rate} onChange={e => setForm(f => ({ ...f, acceptance_rate: Number(e.target.value) }))} />
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Average Runtime (ms)</label>
                  <Input type="number" value={form.average_runtime_ms} onChange={e => setForm(f => ({ ...f, average_runtime_ms: Number(e.target.value) }))} />
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Average Memory (MB)</label>
                  <Input type="number" value={form.average_memory_mb} onChange={e => setForm(f => ({ ...f, average_memory_mb: Number(e.target.value) }))} />
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // Additional Info
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Company Tags</label>
              <div className="flex flex-wrap gap-2 items-center">
                {companyTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleDeleteCompanyTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
                {!showNewCompanyTagInput && (
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={() => setShowNewCompanyTagInput(true)}>+ New Tag</Button>
                )}
                {showNewCompanyTagInput && (
                  <div className="flex items-center gap-2 ml-2">
                    <Input
                      size={8}
                      value={newCompanyTag}
                      onChange={e => setNewCompanyTag(e.target.value)}
                      placeholder="New company tag"
                      className="w-28"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleAddCompanyTag();
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={handleAddCompanyTag}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowNewCompanyTagInput(false); setNewCompanyTag(''); }}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Contest ID</label>
              <Input value={form.contest_id} onChange={e => setForm(f => ({ ...f, contest_id: e.target.value }))} placeholder="If part of a contest" />
              </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.premium_only}
                onChange={e => setForm(f => ({ ...f, premium_only: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span>Premium Only</span>
            </div>

            <div>
              <label className="block font-medium mb-1">Diagram Images</label>
              <div className="space-y-2">
                {diagramImages.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={url} onChange={e => {
                      const newImages = [...diagramImages];
                      newImages[idx] = e.target.value;
                      setDiagramImages(newImages);
                    }} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => {
                      setDiagramImages(diagramImages.filter((_, i) => i !== idx));
                    }}>Delete</Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => setDiagramImages([...diagramImages, ''])}>+ Add Image URL</Button>
                </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Solution Videos</label>
              <div className="space-y-2">
                {solutionVideos.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input value={url} onChange={e => {
                      const newVideos = [...solutionVideos];
                      newVideos[idx] = e.target.value;
                      setSolutionVideos(newVideos);
                    }} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => {
                      setSolutionVideos(solutionVideos.filter((_, i) => i !== idx));
                    }}>Delete</Button>
                                  </div>
                                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => setSolutionVideos([...solutionVideos, ''])}>+ Add Video URL</Button>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-gray-400 text-center py-12">This tab will be implemented soon.</div>;
    }
  };

  // Add validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Core Info validation
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!form.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(form.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!form.difficulty) {
      newErrors.difficulty = 'Difficulty is required';
    }
    if (form.xp_points < 0) {
      newErrors.xp_points = 'XP points cannot be negative';
    }

    // Constraints validation
    if (form.time_limit_ms < 100) {
      newErrors.time_limit_ms = 'Time limit must be at least 100ms';
    }
    if (form.memory_limit_mb < 32) {
      newErrors.memory_limit_mb = 'Memory limit must be at least 32MB';
    }

    // Examples validation
    if (examples.length === 0) {
      newErrors.examples = 'At least one example is required';
    } else {
      examples.forEach((example, index) => {
        if (!example.input.trim() || !example.output.trim()) {
          newErrors.examples = `Example ${index + 1} must have both input and output`;
        }
      });
    }

    // Test cases validation
    if (sampleTests.length === 0) {
      newErrors.sample_tests = 'At least one sample test is required';
    } else {
      sampleTests.forEach((test, index) => {
        if (!test.input.trim() || !test.output.trim()) {
          newErrors.sample_tests = `Sample test ${index + 1} must have both input and output`;
        }
      });
    }

    if (hiddenTests.length === 0) {
      newErrors.hidden_tests = 'At least one hidden test is required';
    } else {
      hiddenTests.forEach((test, index) => {
        if (!test.input.trim() || !test.output.trim()) {
          newErrors.hidden_tests = `Hidden test ${index + 1} must have both input and output`;
        }
      });
    }

    // Code templates validation
    if (!form.code_templates || Object.keys(form.code_templates).length === 0) {
      newErrors.code_templates = 'At least one programming language template is required';
    } else {
      Object.entries(form.code_templates).forEach(([lang, template]) => {
        const typedTemplate = template as { starter_code?: string; solution_code?: string };
        if (!typedTemplate?.starter_code?.trim()) {
          newErrors.code_templates = `${LANGUAGES.find(l => l.value === lang)?.label} starter code is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Improve handleSave with better update logic
  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }

    setIsSubmitting(true);
    setSaveError(null);

    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Prepare the data for GraphQL mutation
      const challengeInput: any = {
        // Core Identity
        title: form.title.trim(),
        slug: slug,
        description: form.description.trim(),
        tags: form.tags,
        difficulty: form.difficulty,
        xp_points: Number(form.xp_points),
        
        // Code Templates
        code_templates: JSON.stringify(form.code_templates),
        
        // Constraints & Limits
        time_limit_ms: Number(form.time_limit_ms),
        memory_limit_mb: Number(form.memory_limit_mb),
        input_constraints: form.input_constraints.trim(),
        
        // Examples & Testcases
        examples: examples.map(example => ({
          input: example.input.trim(),
          output: example.output.trim(),
          explanation: example.explanation.trim()
        })),
        sample_tests: sampleTests.map(test => ({
          input: test.input.trim(),
          output: test.output.trim()
        })),
        hidden_tests: hiddenTests.map(test => ({
          input: test.input.trim(),
          output: test.output.trim()
        })),
        
        // Learning Aids
        hints: form.hints.filter(hint => hint.trim() !== '').map(hint => hint.trim()),
        algorithm_overview: form.algorithm_overview.trim(),
        step_by_step_solution: steps.map(step => ({
          step_number: Number(step.step_number),
          explanation: step.explanation.trim(),
          pseudocode: step.pseudocode.trim()
        })),
        full_editorial: form.full_editorial.trim(),
        
        // Community & Discussion
        discussion_enabled: Boolean(form.discussion_enabled),
        discussion_threads: form.discussion_threads,
        comments_count: Number(form.comments_count),
        
        // Submission Analytics
        submissions_count: Number(form.submissions_count),
        accepted_count: Number(form.accepted_count),
        acceptance_rate: Number(form.acceptance_rate),
        average_runtime_ms: Number(form.average_runtime_ms),
        average_memory_mb: Number(form.average_memory_mb),
        
        // Contest & Organizational
        company_tags: companyTags,
        contest_id: form.contest_id.trim(),
        premium_only: Boolean(form.premium_only),
        
        // Localization & Media
        translations: JSON.stringify(form.translations),
        diagram_images: diagramImages.map(url => url.trim()),
        solution_videos: solutionVideos.map(url => url.trim()),
        
        // Auditing & Versioning
        updated_at: new Date().toISOString(),
        version: (form.version || 0) + 1,
      };

      // Add created_at only for new challenges
      if (!initialData) {
        challengeInput.created_at = new Date().toISOString();
      }

      // For updates, preserve the created_at timestamp
      if (initialData?.created_at) {
        challengeInput.created_at = initialData.created_at;
      }
      
      // Save to DynamoDB via AppSync
      if (initialData) {
        // Update existing challenge
        await client.graphql({
          query: mutations.updateChallenge,
          variables: { 
            input: {
              id: initialData.id,
              ...challengeInput
            }
          },
        });
      } else {
        // Create new challenge
        await client.graphql({
          query: mutations.createChallenge,
          variables: { input: challengeInput },
        });
      }

      toast.success('Challenge saved successfully');
      onClose();
    } catch (err) {
      console.error('Error saving challenge:', err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save challenge');
      toast.error(err instanceof Error ? err.message : 'Failed to save challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Improve tab switching with validation
  const handleTabChange = (newTab: number) => {
    // Only validate if we're trying to save, not when switching tabs
    setActiveTab(newTab);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit' : 'Add'} Code Challenge</h2>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b bg-gray-50 px-6">
          {TABS.map((tab, idx) => (
            <button
              key={tab}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                ${activeTab === idx
                  ? 'border-blue-600 text-blue-700 bg-white shadow'
                  : 'border-transparent text-gray-500 hover:text-blue-600'}`}
              onClick={() => handleTabChange(idx)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="min-h-full">
            {renderTab()}
            {/* Display validation errors */}
            {Object.keys(errors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-700 font-medium mb-2">Please fix the following errors:</h3>
                <ul className="list-disc list-inside text-red-600">
                  {Object.entries(errors).map(([key, value]) => (
                    <li key={key}>{value}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              'Save Challenge'
            )}
          </Button>
          {saveError && (
            <span className="text-red-500 ml-4">{saveError}</span>
          )}
        </div>
      </div>
    </div>
  );
} 