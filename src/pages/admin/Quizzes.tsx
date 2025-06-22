import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import * as queries from '@/graphql/queries';
import * as mutations from '@/graphql/mutations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus, GripVertical } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { QuestionForm } from '@/components/admin/QuestionForm';

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  totalTime: number;
  passingScore: number;
  tags: string[];
  questions: Question[];
  settings: QuizSettings;
  status: 'draft' | 'published';
  createdAt: Date;
}

interface Question {
  id: string;
  type: 'mcq' | 'true-false' | 'fill-blank' | 'matching';
  stem: string;
  options?: string[];
  correctAnswers: string[];
  explanation?: string;
  mediaUrl?: string;
  points: number;
  timeLimit?: number;
  tags: string[];
}

interface QuizSettings {
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  retakePolicy: 'none' | 'once' | 'unlimited';
  visibility: 'public' | 'unlisted' | 'private';
  publishDate?: Date;
  xpPoints: number;
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  // Modal states
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQuestionFormOpen, setIsQuestionFormOpen] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('info');
  const [currentQuiz, setCurrentQuiz] = useState<Partial<Quiz>>({
    title: '',
    slug: '',
    description: '',
    category: '',
    totalTime: 30,
    passingScore: 80,
    tags: [],
    questions: [],
    settings: {
      shuffleQuestions: false,
      shuffleOptions: false,
      showCorrectAnswers: true,
      retakePolicy: 'none',
      visibility: 'public',
      xpPoints: 5,
    },
    status: 'draft',
  });
  const { toast } = useToast();
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const client = generateClient();

  const fetchQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await client.graphql({ query: queries.listQuizzes, variables: { limit: 1000 } });
      const fetchedQuizzes = data?.listQuizzes?.items?.map((item: any) => ({
        id: item.id,
        ...item,
        createdAt: new Date(item.createdAt),
      })) || [];
      setQuizzes(fetchedQuizzes);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // For now, we'll use a hardcoded list since we don't have a separate categories table
      const categoryList = ['Programming', 'Mathematics', 'Science', 'General Knowledge'];
      setCategories(categoryList);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await client.graphql({
        query: mutations.deleteQuiz,
        variables: { input: { id } },
      });
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (err) {
      setError('Failed to delete quiz');
    } finally {
      setDeletingId(null);
    }
  };

  const selectedQuiz = quizzes.find(q => q.id === viewId || q.id === editId);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      // For now, just update local state since we don't have a categories table
      setCategories([...categories, newCategory.trim()]);
      setCurrentQuiz({ ...currentQuiz, category: newCategory.trim() });
      setShowNewCategoryInput(false);
      setNewCategory('');

      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
    }
  };

  const handleEditQuiz = async (id: string) => {
    setEditId(id);
    setIsEditMode(true);
    // Fetch quiz data for editing
    try {
      const { data } = await client.graphql({
        query: queries.getQuiz,
        variables: { id },
      });
      if (data.getQuiz) {
        setCurrentQuiz({ ...data.getQuiz, id });
        setIsAddModalOpen(true);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load quiz data',
        variant: 'destructive',
      });
    }
  };

  const handleSaveQuiz = async (statusOverride?: 'draft' | 'published') => {
    try {
      if (!currentQuiz.title || !currentQuiz.category) {
        toast({
          title: 'Error',
          description: 'Title and category are required',
          variant: 'destructive',
        });
        return;
      }
      const slug = currentQuiz.slug || currentQuiz.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const quizData = {
        ...currentQuiz,
        slug,
        questions: Array.isArray(currentQuiz.questions) ? currentQuiz.questions : [],
        status: statusOverride || currentQuiz.status || 'draft',
        updatedAt: new Date().toISOString(),
      };
      if (isEditMode && currentQuiz.id) {
        // Update existing quiz
        await client.graphql({
          query: mutations.updateQuiz,
          variables: { input: quizData },
        });
        toast({
          title: 'Success',
          description: `Quiz updated successfully`,
        });
      } else {
        // Add new quiz
        await client.graphql({
          query: mutations.createQuiz,
          variables: { input: quizData },
        });
        toast({
          title: 'Success',
          description: `Quiz ${quizData.status === 'draft' ? 'saved as draft' : 'published'} successfully`,
        });
      }
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setEditId(null);
      fetchQuizzes();
    } catch (error: any) {
      console.error('Failed to save quiz:', error);
      toast({
        title: 'Error',
        description: 'Failed to save quiz',
        variant: 'destructive',
      });
    }
  };

  const handleAddQuestion = (question: Question) => {
    if (editingQuestionIndex !== null) {
      const newQuestions = [...(currentQuiz.questions || [])];
      newQuestions[editingQuestionIndex] = question;
      setCurrentQuiz({ ...currentQuiz, questions: newQuestions });
    } else {
      setCurrentQuiz({
        ...currentQuiz,
        questions: [...(currentQuiz.questions || []), { ...question, id: Date.now().toString() }],
      });
    }
    setIsQuestionFormOpen(false);
    setEditingQuestionIndex(null);
  };

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setIsQuestionFormOpen(true);
  };

  const handleDeleteQuestion = (index: number) => {
    const newQuestions = [...(currentQuiz.questions || [])];
    newQuestions.splice(index, 1);
    setCurrentQuiz({ ...currentQuiz, questions: newQuestions });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quizzes</h1>
        <Button
          onClick={() => {
            setCurrentQuiz({
              title: '',
              slug: '',
              description: '',
              category: '',
              totalTime: 30,
              passingScore: 80,
              tags: [],
              questions: [],
              settings: {
                shuffleQuestions: false,
                shuffleOptions: false,
                showCorrectAnswers: true,
                retakePolicy: 'none',
                visibility: 'public',
                xpPoints: 5,
              },
              status: 'draft',
            });
            setIsEditMode(false);
            setEditId(null);
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Quiz
        </Button>
      </div>
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-8">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No quizzes found.</div>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz.id} className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg line-clamp-2">{quiz.title}</h2>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => setViewId(quiz.id)}><Eye className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleEditQuiz(quiz.id)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(quiz.id)} disabled={deletingId === quiz.id}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-1">
                  <Badge variant="secondary" className="capitalize">{quiz.category}</Badge>
                  {quiz.tags && quiz.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  {quiz.questions.length} questions • {quiz.totalTime} mins
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Add Quiz Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Create New Quiz</h2>
              <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>×</Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
              <TabsList className="w-full justify-start border-b px-6">
                <TabsTrigger value="info">Quiz Info</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <div className="p-6">
                  <TabsContent value="info" className="space-y-6">
                    <div>
                      <Label htmlFor="title">Quiz Title</Label>
                      <Input
                        id="title"
                        value={currentQuiz.title}
                        onChange={(e) => setCurrentQuiz({ ...currentQuiz, title: e.target.value })}
                        placeholder="e.g. Quant Aptitude – Set A"
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">Slug / URL ID</Label>
                      <Input
                        id="slug"
                        value={currentQuiz.slug}
                        onChange={(e) => setCurrentQuiz({ ...currentQuiz, slug: e.target.value })}
                        placeholder="auto-generated from title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description / Intro</Label>
                      <Textarea
                        id="description"
                        value={currentQuiz.description}
                        onChange={(e) => setCurrentQuiz({ ...currentQuiz, description: e.target.value })}
                        placeholder="Enter quiz description and instructions..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <div className="flex gap-2">
                        <Select
                          value={currentQuiz.category}
                          onValueChange={(value) => setCurrentQuiz({ ...currentQuiz, category: value })}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {!showNewCategoryInput ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowNewCategoryInput(true)}
                          >
                            + New Category
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter new category"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              className="w-[200px]"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddCategory}
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setShowNewCategoryInput(false);
                                setNewCategory('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="totalTime">Total Time (minutes)</Label>
                        <Input
                          id="totalTime"
                          type="number"
                          value={currentQuiz.totalTime}
                          onChange={(e) => setCurrentQuiz({ ...currentQuiz, totalTime: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                          id="passingScore"
                          type="number"
                          value={currentQuiz.passingScore}
                          onChange={(e) => setCurrentQuiz({ ...currentQuiz, passingScore: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {currentQuiz.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                            <button
                              className="ml-1"
                              onClick={() => setCurrentQuiz({
                                ...currentQuiz,
                                tags: currentQuiz.tags?.filter(t => t !== tag)
                              })}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Input
                          placeholder="Add tag..."
                          className="w-32"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              const value = input.value.trim();
                              if (value && !currentQuiz.tags?.includes(value)) {
                                setCurrentQuiz({
                                  ...currentQuiz,
                                  tags: [...(currentQuiz.tags || []), value]
                                });
                                input.value = '';
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="questions">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-gray-500">
                          Total Questions: {currentQuiz.questions?.length || 0}
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setEditingQuestionIndex(null);
                            setIsQuestionFormOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </div>
                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3">
                          {currentQuiz.questions?.map((question, index) => (
                            <div 
                              key={question.id} 
                              className="flex items-start gap-3 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center gap-2 pt-1">
                                <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                                <div className="text-sm font-medium text-gray-500">{index + 1}</div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium mb-1 line-clamp-2">{question.stem}</div>
                                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                  <Badge variant="secondary" className="capitalize">
                                    {question.type}
                                  </Badge>
                                  <span>•</span>
                                  <span>{question.points} points</span>
                                  {question.timeLimit && (
                                    <>
                                      <span>•</span>
                                      <span>{question.timeLimit}s time limit</span>
                                    </>
                                  )}
                                </div>
                                {question.explanation && (
                                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                                    {question.explanation}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 pt-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEditQuestion(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleDeleteQuestion(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          {(!currentQuiz.questions || currentQuiz.questions.length === 0) && (
                            <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                              <p>No questions added yet</p>
                              <p className="text-sm mt-1">Click "Add Question" to create your first question</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Shuffle Questions</Label>
                        <Switch
                          checked={currentQuiz.settings?.shuffleQuestions}
                          onCheckedChange={(checked) => setCurrentQuiz({
                            ...currentQuiz,
                            settings: { ...currentQuiz.settings, shuffleQuestions: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Shuffle Options (MCQ)</Label>
                        <Switch
                          checked={currentQuiz.settings?.shuffleOptions}
                          onCheckedChange={(checked) => setCurrentQuiz({
                            ...currentQuiz,
                            settings: { ...currentQuiz.settings, shuffleOptions: checked }
                          })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Show Correct Answers</Label>
                        <Switch
                          checked={currentQuiz.settings?.showCorrectAnswers}
                          onCheckedChange={(checked) => setCurrentQuiz({
                            ...currentQuiz,
                            settings: { ...currentQuiz.settings, showCorrectAnswers: checked }
                          })}
                        />
                      </div>
                      <div>
                        <Label>Retake Policy</Label>
                        <Select
                          value={currentQuiz.settings?.retakePolicy}
                          onValueChange={(value: 'none' | 'once' | 'unlimited') => setCurrentQuiz({
                            ...currentQuiz,
                            settings: { ...currentQuiz.settings, retakePolicy: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select retake policy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Retake</SelectItem>
                            <SelectItem value="once">One Retake</SelectItem>
                            <SelectItem value="unlimited">Unlimited within 24h</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Visibility</Label>
                        <Select
                          value={currentQuiz.settings?.visibility}
                          onValueChange={(value: 'public' | 'unlisted' | 'private') => setCurrentQuiz({
                            ...currentQuiz,
                            settings: { ...currentQuiz.settings, visibility: value }
                          })}
                        >
                          <SelectTrigger>
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
                        <Label>XP Points</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={currentQuiz.settings?.xpPoints || 5}
                            onChange={(e) => setCurrentQuiz({
                              ...currentQuiz,
                              settings: { ...currentQuiz.settings, xpPoints: parseInt(e.target.value) || 5 }
                            })}
                            className="w-32"
                          />
                          <span className="text-sm text-gray-500">points awarded on completion</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>

              <div className="flex items-center justify-between p-6 border-t">
                <Button variant="ghost" onClick={() => { setIsAddModalOpen(false); setIsEditMode(false); setEditId(null); }}>Cancel</Button>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleSaveQuiz('draft')}>{isEditMode ? 'Update as Draft' : 'Save as Draft'}</Button>
                  <Button onClick={() => handleSaveQuiz('published')}>{isEditMode ? 'Update & Publish' : 'Publish Quiz'}</Button>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      )}
      {/* View Modal */}
      {viewId && selectedQuiz && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
            <div className="mb-2 text-sm text-gray-600">Slug: <span className="font-mono">{selectedQuiz.slug}</span></div>
            <div className="mb-2 text-gray-700">{selectedQuiz.description}</div>
            <div className="mb-2 flex flex-wrap gap-2">
              <Badge variant="secondary">{selectedQuiz.category}</Badge>
              {selectedQuiz.tags && selectedQuiz.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-gray-300 bg-gray-100 text-gray-600">{tag}</Badge>
              ))}
            </div>
            <div className="flex gap-4 text-sm text-gray-500 mb-4">
              <span>Questions: <b>{selectedQuiz.questions.length}</b></span>
              <span>Total Time: <b>{selectedQuiz.totalTime} min</b></span>
              <span>Passing Score: <b>{selectedQuiz.passingScore}%</b></span>
              <span>XP Points: <b>{selectedQuiz.settings.xpPoints}</b></span>
              <span>Status: <b className={selectedQuiz.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>{selectedQuiz.status}</b></span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Questions Preview</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {selectedQuiz.questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-2 border rounded bg-gray-50">
                    <div className="font-medium">{idx + 1}. {q.stem}</div>
                    <div className="text-xs text-gray-500">Type: {q.type.toUpperCase()} | Points: {q.points}</div>
                  </div>
                ))}
                {selectedQuiz.questions.length === 0 && <div className="text-gray-400">No questions added.</div>}
              </div>
            </div>
            <Button onClick={() => setViewId(null)} className="mt-4">Close</Button>
          </div>
        </div>
      )}
      {/* Question Form Modal */}
      {isQuestionFormOpen && (
        <QuestionForm
          onClose={() => {
            setIsQuestionFormOpen(false);
            setEditingQuestionIndex(null);
          }}
          onSave={handleAddQuestion}
          initialData={editingQuestionIndex !== null ? currentQuiz.questions?.[editingQuestionIndex] : undefined}
        />
      )}
    </div>
  );
} 