import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { firestore } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import MonacoEditor from "@monaco-editor/react";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

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

export function AddCodeChallengePanel({ onClose, initialData }: AddCodeChallengePanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    // Core Identity
    title: '',
    slug: '',
    description: '',
    tags: [] as string[],
    difficulty: 'Easy',
    
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

  // Pre-fill form state if editing
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setForm(f => ({ ...f, title: val, slug: val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }));
  };

  // Tag selection
  const handleTagToggle = (tag: string) => {
    setForm(f => f.tags.includes(tag)
      ? { ...f, tags: f.tags.filter(t => t !== tag) }
      : { ...f, tags: [...f.tags, tag] });
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
                    <Textarea value={hint} onChange={e => {
                      const newHints = [...form.hints];
                      newHints[idx] = e.target.value;
                      setForm(f => ({ ...f, hints: newHints }));
                    }} rows={2} />
                    <Button type="button" size="sm" variant="ghost" onClick={() => {
                      setForm(f => ({ ...f, hints: f.hints.filter((_, i) => i !== idx) }));
                    }}>Delete</Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  setForm(f => ({ ...f, hints: [...f.hints, ''] }));
                }}>+ Add Hint</Button>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Algorithm Overview</label>
              <MarkdownEditor
                value={form.algorithm_overview}
                onChange={value => setForm(f => ({ ...f, algorithm_overview: value }))}
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
                onChange={value => setForm(f => ({ ...f, full_editorial: value }))}
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

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const challengeRef = doc(firestore, 'challenges', slug);
      
      // Update timestamps and version
      const updatedForm = {
        ...form,
        examples,
        sample_tests: sampleTests,
        hidden_tests: hiddenTests,
        step_by_step_solution: steps,
        company_tags: companyTags,
        diagram_images: diagramImages,
        solution_videos: solutionVideos,
        updated_at: serverTimestamp(),
        version: (form.version || 0) + 1,
      };
      
      if (!initialData) {
        updatedForm.created_at = serverTimestamp();
      }
      
      await setDoc(challengeRef, updatedForm);
      setSaving(false);
      onClose();
    } catch (err) {
      setSaving(false);
      setSaveError('Failed to save challenge.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Code Challenge</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
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
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">{renderTab()}</div>
        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 p-6 border-t bg-gray-50">
          <Button variant="ghost" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Code Challenge'}</Button>
          {saveError && <span className="text-red-500 ml-4">{saveError}</span>}
        </div>
      </div>
    </div>
  );
} 