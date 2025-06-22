import React, { useEffect, useState } from 'react';
import { tutorialService, driveService, quizService, collegeService, storageService } from '@/lib/amplifyServices';
import { generateClient } from 'aws-amplify/api';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, Save, ClipboardList, User, Calendar, Paperclip } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { FileUploader } from '@/components/ui/file-uploader';
import ReactMarkdown from 'react-markdown';

interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'inprogress' | 'done' | 'blocked';
  assignee: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  attachments: { url: string; name: string }[];
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  shortDescription: string;
  estimatedEffort: number;
  module: string;
  repoSource: string;
  repoUrl: string;
  repoZipUrl: string;
  specDocUrl: string;
  sampleAssets: { url: string; name: string }[];
  envFiles: { url: string; name: string }[];
  deliverables: string;
  automatedTests: boolean;
  testSuiteUrl: string;
  manualChecklist: string;
  deadline: Date | null;
  submissionFormat: string;
  visibility: string;
  prerequisites: string[];
  maxAttempts: number;
  timeLimit: number;
  metaDescription: string;
  difficulty: string;
}

export default function ProjectTasks() {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [currentTask, setCurrentTask] = useState<Partial<ProjectTask>>({
    title: '',
    description: '',
    status: 'todo',
    assignee: '',
    dueDate: undefined,
    priority: 'medium',
    tags: [],
    attachments: [],
    slug: '',
    shortDescription: '',
    estimatedEffort: 0,
    module: '',
    repoSource: '',
    repoUrl: '',
    repoZipUrl: '',
    specDocUrl: '',
    sampleAssets: [],
    envFiles: [],
    deliverables: '',
    automatedTests: false,
    testSuiteUrl: '',
    manualChecklist: '',
    deadline: null,
    submissionFormat: '',
    visibility: '',
    prerequisites: [],
    maxAttempts: 0,
    timeLimit: 0,
    metaDescription: '',
    difficulty: '',
  });
  const { toast } = useToast();

  // Helper for uploading a file to Amplify Storage
  async function uploadFileToStorage(file: File, folder = 'project-tasks') {
    try {
      const url = await storageService.uploadFile(file, folder);
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Helper to remove undefined fields
  function cleanForAmplify(obj: any) {
    if (Array.isArray(obj)) return obj.map(cleanForAmplify);
    if (obj && typeof obj === 'object') {
      const cleaned: any = {};
      for (const key in obj) {
        if (obj[key] !== undefined) cleaned[key] = cleanForAmplify(obj[key]);
      }
      return cleaned;
    }
    return obj;
  }

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, we'll use the drive service and map drives to project tasks
      // In a real implementation, you'd have a separate projectTasks service
      const drives = await driveService.list();
      const projectTasks = drives.map((drive: any) => ({
        id: drive.id,
        title: drive.driveTitle,
        description: drive.description,
        status: 'todo' as const,
        assignee: '',
        dueDate: drive.endDate ? new Date(drive.endDate) : undefined,
        priority: 'medium' as const,
        tags: [drive.company, drive.driveType].filter(Boolean),
        attachments: [],
        createdAt: drive.createdAt,
        updatedAt: drive.updatedAt,
        slug: drive.driveTitle?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: drive.description,
        estimatedEffort: 0,
        module: drive.module || 'projects',
        repoSource: '',
        repoUrl: '',
        repoZipUrl: '',
        specDocUrl: '',
        sampleAssets: [],
        envFiles: [],
        deliverables: '',
        automatedTests: false,
        testSuiteUrl: '',
        manualChecklist: '',
        deadline: drive.endDate ? new Date(drive.endDate) : null,
        submissionFormat: '',
        visibility: drive.visibility || 'public',
        prerequisites: [],
        maxAttempts: 0,
        timeLimit: 0,
        metaDescription: drive.description,
        difficulty: 'medium',
      } as ProjectTask));
      
      setTasks(projectTasks);
    } catch (err) {
      setError('Failed to load project tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setDeletingId(id);
    try {
      await driveService.delete(id);
      await fetchTasks();
      toast({ title: 'Success', description: 'Task deleted successfully' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to delete task', variant: 'destructive' });
      console.error('Error deleting task:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!currentTask.title || currentTask.title.length < 3) {
      toast({ title: 'Validation Error', description: 'Title must be at least 3 characters long', variant: 'destructive' });
      return;
    }
    try {
      const cleanedTask = cleanForAmplify(currentTask);
      const taskData = {
        ...cleanedTask,
        updatedAt: new Date(),
        // Map project task fields to drive fields
        driveTitle: currentTask.title,
        company: currentTask.module,
        driveType: currentTask.difficulty,
        description: currentTask.description,
        endDate: currentTask.deadline,
        visibility: currentTask.visibility,
        module: currentTask.module,
      };

      if (editId) {
        await driveService.update({ id: editId, ...taskData });
        toast({ title: 'Success', description: 'Task updated successfully' });
      } else {
        await driveService.create({
          ...taskData,
          createdAt: new Date(),
        });
        toast({ title: 'Success', description: 'Task created successfully' });
      }
      setIsAddModalOpen(false);
      setEditId(null);
      fetchTasks();
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to save task', variant: 'destructive' });
      console.error('Error saving task:', err);
    }
  };

  const selectedTask = tasks.find(t => t.id === viewId);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Project Tasks</h1>
        <Button
          onClick={() => {
            setCurrentTask({
              title: '',
              description: '',
              status: 'todo',
              assignee: '',
              dueDate: undefined,
              priority: 'medium',
              tags: [],
              attachments: [],
              slug: '',
              shortDescription: '',
              estimatedEffort: 0,
              module: '',
              repoSource: '',
              repoUrl: '',
              repoZipUrl: '',
              specDocUrl: '',
              sampleAssets: [],
              envFiles: [],
              deliverables: '',
              automatedTests: false,
              testSuiteUrl: '',
              manualChecklist: '',
              deadline: null,
              submissionFormat: '',
              visibility: '',
              prerequisites: [],
              maxAttempts: 0,
              timeLimit: 0,
              metaDescription: '',
              difficulty: '',
            });
            setEditId(null);
            setActiveTab('info');
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No tasks found.</div>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg line-clamp-2">{task.title}</h2>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setViewId(task.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => {
                      setCurrentTask(task);
                      setEditId(task.id);
                      setActiveTab('info');
                      setIsAddModalOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize">{task.status}</Badge>
                  <Badge variant="secondary" className="capitalize">{task.priority}</Badge>
                  {task.tags && task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Assignee: {task.assignee || 'Unassigned'}
                </div>
                <div className="text-xs text-gray-500">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
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
                <span className="text-xs text-gray-500">Step {activeTab === 'info' ? 1 : activeTab === 'assets' ? 2 : activeTab === 'criteria' ? 3 : 4} of 4</span>
                <h2 className="text-xl font-semibold">
                  {editId ? 'Edit Project Task' : 'Create New Project Task'}
                </h2>
              </div>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>×</Button>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="w-full justify-start border-b px-6 bg-gray-50 sticky top-0 z-10 overflow-x-auto">
                <TabsTrigger value="info">Project Info</TabsTrigger>
                <TabsTrigger value="assets">Assets & Repo</TabsTrigger>
                <TabsTrigger value="criteria">Submission Criteria</TabsTrigger>
                <TabsTrigger value="settings">Settings & Visibility</TabsTrigger>
              </TabsList>
              <div className="p-6 overflow-y-auto space-y-8 max-h-[60vh]">
                {/* Tab 1: Project Info */}
                <TabsContent value="info" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="font-semibold">Task Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      value={currentTask.title}
                      onChange={e => {
                        const title = e.target.value;
                        setCurrentTask({
                          ...currentTask,
                          title,
                          slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                        });
                      }}
                      placeholder="e.g. Build a RESTful To-Do API"
                      className={currentTask.title && currentTask.title.length < 5 ? 'border-red-500' : ''}
                      aria-label="Task Title"
                    />
                    {currentTask.title && currentTask.title.length < 5 && (
                      <div className="text-xs text-red-500">Title must be at least 5 characters.</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="font-semibold">Slug / URL</Label>
                    <Input
                      id="slug"
                      value={currentTask.slug}
                      onChange={e => setCurrentTask({ ...currentTask, slug: e.target.value })}
                      placeholder="auto-generated from title"
                      aria-label="Slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortDescription" className="font-semibold">Short Description</Label>
                    <Textarea
                      id="shortDescription"
                      value={currentTask.shortDescription}
                      onChange={e => setCurrentTask({ ...currentTask, shortDescription: e.target.value.slice(0, 200) })}
                      placeholder="One-line summary (max 200 chars)"
                      maxLength={200}
                      aria-label="Short Description"
                    />
                    <div className="text-xs text-gray-500">{currentTask.shortDescription?.length || 0}/200 characters</div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Full Description</Label>
                    <MarkdownEditor
                      value={currentTask.description}
                      onChange={value => setCurrentTask({ ...currentTask, description: value })}
                      placeholder="Detailed spec, user story, acceptance criteria..."
                      aria-label="Full Description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEffort" className="font-semibold">Estimated Effort (hours)</Label>
                    <Input
                      id="estimatedEffort"
                      type="number"
                      value={currentTask.estimatedEffort}
                      onChange={e => setCurrentTask({ ...currentTask, estimatedEffort: parseInt(e.target.value) })}
                      aria-label="Estimated Effort"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Module Association</Label>
                    <Select
                      value={currentTask.module}
                      onValueChange={value => setCurrentTask({ ...currentTask, module: value })}
                      aria-label="Module Association"
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select module" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bootcamp">Bootcamp</SelectItem>
                        <SelectItem value="dsa">DSA</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Tags / Keywords</Label>
                    <MultiSelect
                      value={currentTask.tags}
                      onChange={tags => setCurrentTask({ ...currentTask, tags })}
                      placeholder="e.g. REST API, Node.js, CRUD"
                      aria-label="Tags"
                    />
                  </div>
                </TabsContent>

                {/* Tab 2: Assets & Repo */}
                <TabsContent value="assets" className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Template Repo</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={currentTask.repoSource === 'github'}
                          onChange={() => setCurrentTask({ ...currentTask, repoSource: 'github', repoZipUrl: '' })}
                          aria-label="GitHub Link"
                        />
                        GitHub Link
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={currentTask.repoSource === 'zip'}
                          onChange={() => setCurrentTask({ ...currentTask, repoSource: 'zip', repoUrl: '' })}
                          aria-label="Upload ZIP"
                        />
                        Upload ZIP
                      </label>
                    </div>
                    {currentTask.repoSource === 'github' && (
                      <Input
                        value={currentTask.repoUrl}
                        onChange={e => setCurrentTask({ ...currentTask, repoUrl: e.target.value })}
                        placeholder="Paste GitHub repo URL"
                        aria-label="GitHub Repo URL"
                      />
                    )}
                    {currentTask.repoSource === 'zip' && (
                      <FileUploader
                        accept=".zip"
                        onUpload={async (files) => {
                          if (files[0].size > 100 * 1024 * 1024) {
                            toast({ title: 'File too large', description: 'Max 100MB allowed', variant: 'destructive' });
                            return;
                          }
                          const url = await uploadFileToStorage(files[0], 'project-tasks/repos');
                          setCurrentTask({ ...currentTask, repoZipUrl: url });
                        }}
                        maxFiles={1}
                      />
                    )}
                    {currentTask.repoZipUrl && (
                      <a href={currentTask.repoZipUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs">View Uploaded ZIP</a>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Specification Document</Label>
                    <FileUploader
                      accept=".pdf,.md,.docx"
                      onUpload={async (files) => {
                        const url = await uploadFileToStorage(files[0], 'project-tasks/specs');
                        setCurrentTask({ ...currentTask, specDocUrl: url });
                      }}
                      maxFiles={1}
                    />
                    {currentTask.specDocUrl && (
                      <a href={currentTask.specDocUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs">View Spec Document</a>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Sample Data / Assets</Label>
                    <FileUploader
                      accept=".csv,.json,image/*"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'project-tasks/assets');
                          return { url, name: file.name };
                        }));
                        setCurrentTask({
                          ...currentTask,
                          sampleAssets: [...(currentTask.sampleAssets || []), ...uploaded],
                        });
                      }}
                      maxFiles={10}
                    />
                    <ul className="mt-2 text-xs">
                      {(currentTask.sampleAssets || []).map((asset, i) => (
                        <li key={i}><a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline">{asset.name}</a></li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Environment Files</Label>
                    <FileUploader
                      accept=".dockerfile,.txt,.json,.js,.ts,.yml,.yaml"
                      onUpload={async (files) => {
                        const uploaded = await Promise.all(files.map(async (file) => {
                          const url = await uploadFileToStorage(file, 'project-tasks/env');
                          return { url, name: file.name };
                        }));
                        setCurrentTask({
                          ...currentTask,
                          envFiles: [...(currentTask.envFiles || []), ...uploaded],
                        });
                      }}
                      maxFiles={10}
                    />
                    <ul className="mt-2 text-xs">
                      {(currentTask.envFiles || []).map((env, i) => (
                        <li key={i}><a href={env.url} target="_blank" rel="noopener noreferrer" className="underline">{env.name}</a></li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Tab 3: Submission Criteria */}
                <TabsContent value="criteria" className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Deliverables</Label>
                    <Textarea
                      value={currentTask.deliverables}
                      onChange={e => setCurrentTask({ ...currentTask, deliverables: e.target.value })}
                      placeholder="Bullet list of expected outputs..."
                      rows={3}
                      aria-label="Deliverables"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Automated Tests</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!currentTask.automatedTests}
                        onChange={e => setCurrentTask({ ...currentTask, automatedTests: e.target.checked })}
                        aria-label="Automated Tests Toggle"
                      />
                      Enable Automated Tests
                    </div>
                    {currentTask.automatedTests && (
                      <FileUploader
                        accept="application/javascript,text/x-python"
                        onUpload={async (files) => {
                          const url = await uploadFileToStorage(files[0], 'project-tasks/tests');
                          setCurrentTask({ ...currentTask, testSuiteUrl: url });
                        }}
                        maxFiles={1}
                      />
                    )}
                    {currentTask.testSuiteUrl && (
                      <a href={currentTask.testSuiteUrl} target="_blank" rel="noopener noreferrer" className="underline text-xs">View Test Suite</a>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Manual Review Checklist</Label>
                    <Textarea
                      value={currentTask.manualChecklist}
                      onChange={e => setCurrentTask({ ...currentTask, manualChecklist: e.target.value })}
                      placeholder="Bullet list for reviewers: code style, documentation, etc."
                      rows={3}
                      aria-label="Manual Review Checklist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Deadline</Label>
                    <DateTimePicker
                      value={currentTask.deadline ? new Date(currentTask.deadline) : undefined}
                      onChange={date => setCurrentTask({ ...currentTask, deadline: date })}
                      aria-label="Deadline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Submission Format</Label>
                    <Select
                      value={currentTask.submissionFormat}
                      onValueChange={value => setCurrentTask({ ...currentTask, submissionFormat: value })}
                      aria-label="Submission Format"
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="github-pr">GitHub PR</SelectItem>
                        <SelectItem value="zip-upload">ZIP Upload</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                {/* Tab 4: Settings & Visibility */}
                <TabsContent value="settings" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label>Status</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {currentTask.status === 'todo' ? 'Draft' : 'Live'}
                      </span>
                      <input
                        type="checkbox"
                        checked={currentTask.status === 'done'}
                        onChange={e => setCurrentTask({ ...currentTask, status: e.target.checked ? 'done' : 'todo' })}
                        aria-label="Status Toggle"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Visibility</Label>
                    <Select
                      value={currentTask.visibility}
                      onValueChange={value => setCurrentTask({ ...currentTask, visibility: value })}
                      aria-label="Visibility"
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
                    <Label>Prerequisites</Label>
                    <MultiSelect
                      value={currentTask.prerequisites}
                      onChange={prerequisites => setCurrentTask({ ...currentTask, prerequisites })}
                      placeholder="Select prerequisite modules/lessons..."
                      aria-label="Prerequisites"
                    />
                  </div>
                  <div>
                    <Label>Max Attempts</Label>
                    <Input
                      type="number"
                      value={currentTask.maxAttempts}
                      onChange={e => setCurrentTask({ ...currentTask, maxAttempts: parseInt(e.target.value) })}
                      aria-label="Max Attempts"
                    />
                  </div>
                  <div>
                    <Label>Time Limit (days)</Label>
                    <Input
                      type="number"
                      value={currentTask.timeLimit}
                      onChange={e => setCurrentTask({ ...currentTask, timeLimit: parseInt(e.target.value) })}
                      aria-label="Time Limit"
                    />
                  </div>
                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      value={currentTask.metaDescription}
                      onChange={e => setCurrentTask({ ...currentTask, metaDescription: e.target.value })}
                      placeholder="Enter meta description (max 160 characters)"
                      maxLength={160}
                      aria-label="Meta Description"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      {currentTask.metaDescription?.length || 0}/160 characters
                    </div>
                  </div>
                  <div>
                    <Label>Difficulty Level</Label>
                    <Select
                      value={currentTask.difficulty}
                      onValueChange={value => setCurrentTask({ ...currentTask, difficulty: value })}
                      aria-label="Difficulty Level"
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select difficulty" />
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
      {viewId && selectedTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-4 right-4 text-xl text-gray-400 hover:text-gray-700 focus:outline-none"
              onClick={() => setViewId(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedTask.title}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="capitalize">{selectedTask.status}</Badge>
              <Badge variant="secondary" className="capitalize">{selectedTask.difficulty}</Badge>
              <Badge variant="secondary" className="capitalize">{selectedTask.module}</Badge>
              <Badge variant="secondary" className="capitalize">Effort: {selectedTask.estimatedEffort}h</Badge>
              <Badge variant="secondary" className="capitalize">Attempts: {selectedTask.maxAttempts}</Badge>
              <Badge variant="secondary" className="capitalize">{selectedTask.visibility}</Badge>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedTask.tags && selectedTask.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
              ))}
            </div>
            <div className="mb-2 text-xs text-gray-500">
              <span className="font-mono">Slug: {selectedTask.slug}</span>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
              <h3 className="font-semibold text-lg mb-1">Project Info</h3>
              <div className="mb-2 text-gray-700">
                <strong>Short Description:</strong>
                <div className="text-sm text-gray-800">{selectedTask.shortDescription}</div>
              </div>
              <div className="mb-2 text-gray-700">
                <strong>Full Description:</strong>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{selectedTask.description}</ReactMarkdown>
                </div>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Meta Description:</strong> {selectedTask.metaDescription}
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
              <h3 className="font-semibold text-lg mb-1">Assets & Repo</h3>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Template Repo:</strong> {selectedTask.repoSource === 'github' && selectedTask.repoUrl && (
                  <a href={selectedTask.repoUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><ClipboardList className="w-4 h-4 inline" />GitHub Link</a>
                )}
                {selectedTask.repoSource === 'zip' && selectedTask.repoZipUrl && (
                  <a href={selectedTask.repoZipUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><ClipboardList className="w-4 h-4 inline" />ZIP File</a>
                )}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Specification Document:</strong> {selectedTask.specDocUrl && (
                  <a href={selectedTask.specDocUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><Paperclip className="w-4 h-4 inline" />View Spec</a>
                )}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Sample Data / Assets:</strong>
                <ul className="mt-1 text-xs">
                  {(selectedTask.sampleAssets || []).map((asset, i) => (
                    <li key={i}><a href={asset.url} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><Paperclip className="w-4 h-4 inline" />{asset.name}</a></li>
                  ))}
                </ul>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Environment Files:</strong>
                <ul className="mt-1 text-xs">
                  {(selectedTask.envFiles || []).map((env, i) => (
                    <li key={i}><a href={env.url} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><Paperclip className="w-4 h-4 inline" />{env.name}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
              <h3 className="font-semibold text-lg mb-1">Submission Criteria</h3>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Deliverables:</strong>
                <div className="whitespace-pre-line text-gray-800">{selectedTask.deliverables}</div>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Automated Tests:</strong> {selectedTask.automatedTests ? 'Enabled' : 'Disabled'}
                {selectedTask.testSuiteUrl && (
                  <span> | <a href={selectedTask.testSuiteUrl} target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1"><Paperclip className="w-4 h-4 inline" />View Test Suite</a></span>
                )}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Manual Review Checklist:</strong>
                <div className="whitespace-pre-line text-gray-800">{selectedTask.manualChecklist}</div>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleString() : 'None'}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Submission Format:</strong> {selectedTask.submissionFormat}
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-2">
              <h3 className="font-semibold text-lg mb-1">Settings & Visibility</h3>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Prerequisites:</strong> {(selectedTask.prerequisites || []).join(', ')}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Max Attempts:</strong> {selectedTask.maxAttempts}
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <strong>Time Limit (days):</strong> {selectedTask.timeLimit}
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