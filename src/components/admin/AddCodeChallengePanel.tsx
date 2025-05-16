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

interface AddCodeChallengePanelProps {
  onClose: () => void;
  initialData?: any;
}

const TABS = [
  'General Info',
  'Starter Code & Settings',
  'Test Cases',
  'Hints',
  'Solution Editorial',
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const TRACKS = ['DSA', 'Arrays', 'Strings', 'Hash Table', 'Math'];
const TAGS = ['arrays', 'hash-table', 'math', 'two-pointers', 'sorting', 'greedy'];
const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];
const EDITOR_TAGS = ['Array', 'Two Pointers', 'Hash Map', 'Math', 'Sorting', 'Greedy'];

export function AddCodeChallengePanel({ onClose, initialData }: AddCodeChallengePanelProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    difficulty: 'Easy',
    tags: [] as string[],
    track: '',
    // ...other fields for other tabs
  });
  // State for adding new tag/track
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(TAGS);
  const [showNewTrackInput, setShowNewTrackInput] = useState(false);
  const [newTrack, setNewTrack] = useState('');
  const [tracks, setTracks] = useState(TRACKS);
  // Starter code & settings state
  const [languages, setLanguages] = useState<string[]>(['python', 'javascript']);
  const [starterCode, setStarterCode] = useState<{ [lang: string]: string }>({ python: '', javascript: '' });
  const [timeLimit, setTimeLimit] = useState(1000);
  const [memoryLimit, setMemoryLimit] = useState(256);
  const [visibleTestCases, setVisibleTestCases] = useState(1);
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [showNewEditorTagInput, setShowNewEditorTagInput] = useState(false);
  const [newEditorTag, setNewEditorTag] = useState('');
  const [editorTagsList, setEditorTagsList] = useState(EDITOR_TAGS);
  // Test cases state
  const [testCases, setTestCases] = useState([
    // Example initial test case
    // { input: '', expected: '', type: 'sample', weight: 1 }
  ]);
  const [showAddTestCase, setShowAddTestCase] = useState(false);
  const [newTestCase, setNewTestCase] = useState({ input: '', expected: '', type: 'sample', weight: 1 });
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editTestCase, setEditTestCase] = useState({ input: '', expected: '', type: 'sample', weight: 1 });
  // Hints state
  const [hints, setHints] = useState<{
    text: string;
    unlocksAfter: number | undefined;
  }[]>([]);
  const [showAddHint, setShowAddHint] = useState(false);
  const [newHint, setNewHint] = useState({ text: '', unlocksAfter: undefined as number | undefined });
  const [editHintIdx, setEditHintIdx] = useState<number | null>(null);
  const [editHint, setEditHint] = useState({ text: '', unlocksAfter: undefined as number | undefined });
  // Editorial steps state
  const [editorialSteps, setEditorialSteps] = useState<{
    title: string;
    content: string;
    codeSamples: { [lang: string]: string };
  }[]>([]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [newStep, setNewStep] = useState({ title: '', content: '', codeSamples: {} as { [lang: string]: string } });
  const [editStepIdx, setEditStepIdx] = useState<number | null>(null);
  const [editStep, setEditStep] = useState({ title: '', content: '', codeSamples: {} as { [lang: string]: string } });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Pre-fill form state if editing
  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        difficulty: initialData.difficulty || 'Easy',
        tags: initialData.tags || [],
        track: initialData.track || '',
      });
      setLanguages(initialData.languagesSupported || ['python', 'javascript']);
      setStarterCode(initialData.starterCode || { python: '', javascript: '' });
      setTimeLimit(initialData.timeLimitMs || 1000);
      setMemoryLimit(initialData.memoryLimitMb || 256);
      setVisibleTestCases(initialData.visibleTestCases || 1);
      setEditorTags(initialData.editorTags || []);
      setTestCases(initialData.testCases || []);
      setHints(initialData.hints || []);
      setEditorialSteps(initialData.editorialSteps || []);
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

  // Tab content renderers
  const renderTab = () => {
    switch (activeTab) {
      case 0:
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
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Full prompt with examples, constraints (Markdown supported)" rows={6} />
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
            <div>
              <label className="block font-medium mb-1">Category / Track</label>
              <div className="flex items-center gap-2">
                <Select value={form.track} onValueChange={val => setForm(f => ({ ...f, track: val }))}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                {!showNewTrackInput && (
                  <Button type="button" size="sm" variant="outline" onClick={() => setShowNewTrackInput(true)}>+ New Track</Button>
                )}
                {showNewTrackInput && (
                  <div className="flex items-center gap-2">
                    <Input
                      size={8}
                      value={newTrack}
                      onChange={e => setNewTrack(e.target.value)}
                      placeholder="New track"
                      className="w-28"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newTrack.trim()) {
                          setTracks([...tracks, newTrack.trim()]);
                          setForm(f => ({ ...f, track: newTrack.trim() }));
                          setNewTrack('');
                          setShowNewTrackInput(false);
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={() => {
                      if (newTrack.trim()) {
                        setTracks([...tracks, newTrack.trim()]);
                        setForm(f => ({ ...f, track: newTrack.trim() }));
                        setNewTrack('');
                        setShowNewTrackInput(false);
                      }
                    }}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowNewTrackInput(false); setNewTrack(''); }}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Languages Supported</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <Badge
                    key={lang.value}
                    variant={languages.includes(lang.value) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => {
                      if (languages.includes(lang.value)) {
                        setLanguages(languages.filter(l => l !== lang.value));
                        const newStarter = { ...starterCode };
                        delete newStarter[lang.value];
                        setStarterCode(newStarter);
                      } else {
                        setLanguages([...languages, lang.value]);
                        setStarterCode({ ...starterCode, [lang.value]: '' });
                      }
                    }}
                  >
                    {lang.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 mb-6 border">
              <h3 className="text-lg font-semibold mb-2">Starter Code</h3>
              <div className="flex flex-wrap gap-6">
                {languages.map(lang => (
                  <div key={lang} className="flex flex-col mb-4" style={{ width: 400 }}>
                    <label className="text-xs font-semibold mb-1">
                      {LANGUAGES.find(l => l.value === lang)?.label || lang}
                    </label>
                    <div className="rounded border border-gray-200 overflow-hidden">
                      <MonacoEditor
                        height="150px"
                        defaultLanguage={lang}
                        language={lang}
                        value={starterCode[lang]}
                        onChange={value => setStarterCode({ ...starterCode, [lang]: value || "" })}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          wordWrap: "on",
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block font-medium mb-1">Time Limit (ms)</label>
                <Input type="number" min={100} value={timeLimit} onChange={e => setTimeLimit(Number(e.target.value))} className="w-32" />
              </div>
              <div>
                <label className="block font-medium mb-1">Memory Limit (MB)</label>
                <Input type="number" min={32} value={memoryLimit} onChange={e => setMemoryLimit(Number(e.target.value))} className="w-32" />
              </div>
              <div>
                <label className="block font-medium mb-1">Visible Test Cases Count</label>
                <Input type="number" min={1} value={visibleTestCases} onChange={e => setVisibleTestCases(Number(e.target.value))} className="w-32" />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Editor Tags</label>
              <div className="flex flex-wrap gap-2 items-center">
                {editorTagsList.map(tag => (
                  <Badge
                    key={tag}
                    variant={editorTags.includes(tag) ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => setEditorTags(editorTags.includes(tag) ? editorTags.filter(t => t !== tag) : [...editorTags, tag])}
                  >
                    {tag}
                  </Badge>
                ))}
                {!showNewEditorTagInput && (
                  <Button type="button" size="sm" variant="outline" className="ml-2" onClick={() => setShowNewEditorTagInput(true)}>+ New Tag</Button>
                )}
                {showNewEditorTagInput && (
                  <div className="flex items-center gap-2 ml-2">
                    <Input
                      size={8}
                      value={newEditorTag}
                      onChange={e => setNewEditorTag(e.target.value)}
                      placeholder="New tag"
                      className="w-28"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newEditorTag.trim()) {
                          setEditorTagsList([...editorTagsList, newEditorTag.trim()]);
                          setEditorTags([...editorTags, newEditorTag.trim()]);
                          setNewEditorTag('');
                          setShowNewEditorTagInput(false);
                        }
                      }}
                    />
                    <Button type="button" size="sm" onClick={() => {
                      if (newEditorTag.trim()) {
                        setEditorTagsList([...editorTagsList, newEditorTag.trim()]);
                        setEditorTags([...editorTags, newEditorTag.trim()]);
                        setNewEditorTag('');
                        setShowNewEditorTagInput(false);
                      }
                    }}>Add</Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => { setShowNewEditorTagInput(false); setNewEditorTag(''); }}>Cancel</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Test Cases</label>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Input</th>
                      <th className="p-2">Expected Output</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Weight</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCases.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-4">No test cases yet.</td></tr>
                    )}
                    {testCases.map((tc, idx) => (
                      <tr key={idx}>
                        {editIdx === idx ? (
                          <>
                            <td><Input value={editTestCase.input} onChange={e => setEditTestCase({ ...editTestCase, input: e.target.value })} /></td>
                            <td><Input value={editTestCase.expected} onChange={e => setEditTestCase({ ...editTestCase, expected: e.target.value })} /></td>
                            <td>
                              <Select value={editTestCase.type} onValueChange={val => setEditTestCase({ ...editTestCase, type: val })}>
                                <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sample">Sample</SelectItem>
                                  <SelectItem value="hidden">Hidden</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td><Input type="number" value={editTestCase.weight} min={1} onChange={e => setEditTestCase({ ...editTestCase, weight: Number(e.target.value) })} className="w-16" /></td>
                            <td>
                              <Button type="button" size="sm" onClick={() => {
                                setTestCases(testCases.map((t, i) => i === idx ? editTestCase : t));
                                setEditIdx(null);
                              }}>Save</Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => setEditIdx(null)}>Cancel</Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{tc.input}</td>
                            <td>{tc.expected}</td>
                            <td className="capitalize">{tc.type}</td>
                            <td>{tc.weight}</td>
                            <td>
                              <Button type="button" size="icon" variant="ghost" onClick={() => { setEditIdx(idx); setEditTestCase(tc); }}>Edit</Button>
                              <Button type="button" size="icon" variant="ghost" onClick={() => setTestCases(testCases.filter((_, i) => i !== idx))}>Delete</Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add Test Case mini-form */}
              {showAddTestCase ? (
                <div className="flex flex-wrap gap-2 mt-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium mb-1">Input</label>
                    <Input value={newTestCase.input} onChange={e => setNewTestCase({ ...newTestCase, input: e.target.value })} placeholder="Input (text or JSON)" className="w-40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Expected Output</label>
                    <Input value={newTestCase.expected} onChange={e => setNewTestCase({ ...newTestCase, expected: e.target.value })} placeholder="Expected (text or JSON)" className="w-40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Type</label>
                    <Select value={newTestCase.type} onValueChange={val => setNewTestCase({ ...newTestCase, type: val })}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sample">Sample</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Weight</label>
                    <Input type="number" min={1} value={newTestCase.weight} onChange={e => setNewTestCase({ ...newTestCase, weight: Number(e.target.value) })} className="w-16" />
                  </div>
                  <Button type="button" size="sm" onClick={() => {
                    setTestCases([...testCases, newTestCase]);
                    setNewTestCase({ input: '', expected: '', type: 'sample', weight: 1 });
                    setShowAddTestCase(false);
                  }}>Add</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddTestCase(false)}>Cancel</Button>
                </div>
              ) : (
                <Button type="button" size="sm" variant="outline" className="mt-4" onClick={() => setShowAddTestCase(true)}>+ Add Test Case</Button>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Hints</label>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Order</th>
                      <th className="p-2">Hint Text</th>
                      <th className="p-2">Unlocks After N Attempts</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hints.length === 0 && (
                      <tr><td colSpan={4} className="text-center text-gray-400 py-4">No hints yet.</td></tr>
                    )}
                    {hints.map((hint, idx) => (
                      <tr key={idx}>
                        {editHintIdx === idx ? (
                          <>
                            <td>{idx + 1}</td>
                            <td>
                              <Textarea value={editHint.text} onChange={e => setEditHint({ ...editHint, text: e.target.value })} rows={2} className="w-64" />
                            </td>
                            <td>
                              <Input type="number" min={0} value={editHint.unlocksAfter ?? ''} onChange={e => setEditHint({ ...editHint, unlocksAfter: e.target.value ? Number(e.target.value) : undefined })} className="w-24" placeholder="Optional" />
                            </td>
                            <td>
                              <Button type="button" size="sm" onClick={() => {
                                setHints(hints.map((h, i) => i === idx ? editHint : h));
                                setEditHintIdx(null);
                              }}>Save</Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => setEditHintIdx(null)}>Cancel</Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{idx + 1}</td>
                            <td>{hint.text}</td>
                            <td>{hint.unlocksAfter ?? '-'}</td>
                            <td>
                              <Button type="button" size="icon" variant="ghost" onClick={() => { setEditHintIdx(idx); setEditHint(hint); }}>Edit</Button>
                              <Button type="button" size="icon" variant="ghost" onClick={() => setHints(hints.filter((_, i) => i !== idx))}>Delete</Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add Hint mini-form */}
              {showAddHint ? (
                <div className="flex flex-wrap gap-2 mt-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium mb-1">Hint Text</label>
                    <Textarea value={newHint.text} onChange={e => setNewHint({ ...newHint, text: e.target.value })} placeholder="Hint text" className="w-64" rows={2} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Unlocks After (failed runs, optional)</label>
                    <Input type="number" min={0} value={newHint.unlocksAfter ?? ''} onChange={e => setNewHint({ ...newHint, unlocksAfter: e.target.value ? Number(e.target.value) : undefined })} className="w-24" placeholder="Optional" />
                  </div>
                  <Button type="button" size="sm" onClick={() => {
                    setHints([...hints, { ...newHint, unlocksAfter: newHint.unlocksAfter }]);
                    setNewHint({ text: '', unlocksAfter: undefined });
                    setShowAddHint(false);
                  }}>Add</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddHint(false)}>Cancel</Button>
                </div>
              ) : (
                <Button type="button" size="sm" variant="outline" className="mt-4" onClick={() => setShowAddHint(true)}>+ Add Hint</Button>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Solution Editorial Steps</label>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs border mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Order</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Content</th>
                      <th className="p-2">Code Samples</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editorialSteps.length === 0 && (
                      <tr><td colSpan={5} className="text-center text-gray-400 py-4">No editorial steps yet.</td></tr>
                    )}
                    {editorialSteps.map((step, idx) => (
                      <tr key={idx}>
                        {editStepIdx === idx ? (
                          <>
                            <td>{idx + 1}</td>
                            <td><Input value={editStep.title} onChange={e => setEditStep({ ...editStep, title: e.target.value })} className="w-40" /></td>
                            <td><Textarea value={editStep.content} onChange={e => setEditStep({ ...editStep, content: e.target.value })} rows={2} className="w-64" /></td>
                            <td>
                              <div className="flex flex-col gap-2">
                                {languages.map(lang => (
                                  <div key={lang}>
                                    <span className="text-xs font-semibold">{LANGUAGES.find(l => l.value === lang)?.label || lang}</span>
                                    <Textarea
                                      value={editStep.codeSamples[lang] || ''}
                                      onChange={e => setEditStep({ ...editStep, codeSamples: { ...editStep.codeSamples, [lang]: e.target.value } })}
                                      rows={2}
                                      className="w-40"
                                      placeholder={`Code sample for ${lang}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Button type="button" size="sm" onClick={() => {
                                setEditorialSteps(editorialSteps.map((s, i) => i === idx ? editStep : s));
                                setEditStepIdx(null);
                              }}>Save</Button>
                              <Button type="button" size="sm" variant="ghost" onClick={() => setEditStepIdx(null)}>Cancel</Button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{idx + 1}</td>
                            <td>{step.title}</td>
                            <td className="max-w-xs truncate" title={step.content}>{step.content.slice(0, 60)}{step.content.length > 60 ? '...' : ''}</td>
                            <td>
                              <div className="flex flex-col gap-1">
                                {Object.entries(step.codeSamples).map(([lang, code]) => (
                                  <div key={lang} className="text-xs"><span className="font-semibold">{lang}:</span> <span className="truncate">{code.slice(0, 20)}{code.length > 20 ? '...' : ''}</span></div>
                                ))}
                              </div>
                            </td>
                            <td>
                              <Button type="button" size="icon" variant="ghost" onClick={() => { setEditStepIdx(idx); setEditStep(step); }}>Edit</Button>
                              <Button type="button" size="icon" variant="ghost" onClick={() => setEditorialSteps(editorialSteps.filter((_, i) => i !== idx))}>Delete</Button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Add Step mini-form */}
              {showAddStep ? (
                <div className="flex flex-wrap gap-2 mt-4 items-end bg-gray-50 p-4 rounded-lg">
                  <div>
                    <label className="block text-xs font-medium mb-1">Step Title</label>
                    <Input value={newStep.title} onChange={e => setNewStep({ ...newStep, title: e.target.value })} placeholder="Step title" className="w-40" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Content (Markdown)</label>
                    <Textarea value={newStep.content} onChange={e => setNewStep({ ...newStep, content: e.target.value })} placeholder="Step explanation (markdown)" className="w-64" rows={2} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-xs font-medium mb-1">Code Samples</label>
                    {languages.map(lang => (
                      <div key={lang}>
                        <span className="text-xs font-semibold">{LANGUAGES.find(l => l.value === lang)?.label || lang}</span>
                        <Textarea
                          value={newStep.codeSamples[lang] || ''}
                          onChange={e => setNewStep({ ...newStep, codeSamples: { ...newStep.codeSamples, [lang]: e.target.value } })}
                          rows={2}
                          className="w-40"
                          placeholder={`Code sample for ${lang}`}
                        />
                      </div>
                    ))}
                  </div>
                  <Button type="button" size="sm" onClick={() => {
                    setEditorialSteps([...editorialSteps, newStep]);
                    setNewStep({ title: '', content: '', codeSamples: {} });
                    setShowAddStep(false);
                  }}>Add</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddStep(false)}>Cancel</Button>
                </div>
              ) : (
                <Button type="button" size="sm" variant="outline" className="mt-4" onClick={() => setShowAddStep(true)}>+ Add Step</Button>
              )}
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
      // 1. Main challenge doc
      const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const challengeRef = doc(firestore, 'challenges', slug);
      await setDoc(challengeRef, {
        title: form.title,
        slug,
        description: form.description,
        difficulty: form.difficulty,
        tags: form.tags,
        track: form.track,
        languagesSupported: languages,
        starterCode,
        timeLimitMs: timeLimit,
        memoryLimitMb: memoryLimit,
        visibleTestCases,
        editorTags,
        createdAt: initialData ? initialData.createdAt || serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // 2. Test cases
      for (const tc of testCases) {
        await addDoc(collection(challengeRef, 'testCases'), {
          input: tc.input,
          expected: tc.expected,
          type: tc.type,
          weight: tc.weight,
        });
      }
      // 3. Hints
      for (let i = 0; i < hints.length; ++i) {
        const hint = hints[i];
        await addDoc(collection(challengeRef, 'hints'), {
          order: i + 1,
          text: hint.text,
          unlocksAfter: hint.unlocksAfter,
        });
      }
      // 4. Editorial steps
      for (let i = 0; i < editorialSteps.length; ++i) {
        const step = editorialSteps[i];
        await addDoc(collection(challengeRef, 'editorialSteps'), {
          order: i + 1,
          title: step.title,
          content: step.content,
          codeSamples: step.codeSamples,
        });
      }
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
              {/* Optionally add an icon here */}
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